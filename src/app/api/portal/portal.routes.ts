import { Constants, Responses, HashService, SuccessResponse } from '@core/helpers';
import { Post, Router, Get } from '@lib/restful';
import { Request, Response } from 'express';
import usersService from '@api/users/users.service';
import { UsersSchema } from '@api/users';
import { Payload, PrimaryKey } from '@lib/mongoose';
import { EmailService, fakeEmail } from '@shared/email';
import { AppUtils, cast } from '@core/utils';
import { PortalHelper } from './portal.helper';
import { TokenExpiredError } from 'jsonwebtoken';
import { ApplicationConstants } from '@core/constants';
import { sessionsService } from '@api/sessions/sessions.service';
import { IsString, IsNotEmpty, IsJWT, IsInt, isString } from 'class-validator';
import { scheduleJob } from 'node-schedule';
import { validate, EmailValidator } from '@shared/common';
import { tokenService, IRefreshTokenClaim } from '@shared/identity';

class Pincode {
    public ttl = AppUtils.duration(5);
    constructor(
        public pincode: string
    ) { }
}

/**
 * a Map consist of key-value pair of user id and pincode
 */
const pincodes = new Map<string, Pincode>();

export class AccountVerifiedPayload {
    @IsNotEmpty()
    @IsString()
    username: string = null;
    @IsNotEmpty()
    @IsString()
    firstName: string = null;
    @IsNotEmpty()
    @IsString()
    lastName: string = null;
    @IsNotEmpty()
    @IsString()
    placeOfBirth: string = null;
}

export class CredentialsPayload {
    @IsString()
    @IsNotEmpty()
    public username: string = null;
    @IsString()
    @IsNotEmpty()
    public password: string = null;
}

export class RefreshTokenPayload {
    @IsString()
    @IsJWT()
    public token: string = null;
    @IsString()
    @IsJWT()
    public refreshToken: string = null;
}

export class PincodeValidator extends EmailValidator {
    @IsNotEmpty()
    @IsString()
    pincode: string = null;
}

export class DeviceUUIDHeaderValidator {
    @IsString()
    public [ApplicationConstants.deviceIdHeader] = null;
}

export class RefreshTokenDto {
    public token: string;
    public refreshToken: string;
    constructor(user_id: PrimaryKey, role: string, verified: boolean) {
        this.token = PortalHelper.generateToken(user_id, role, verified);
        this.refreshToken = PortalHelper.generateRefreshToken(user_id);
    }
}

export class LoginDto extends RefreshTokenDto { }

@Router(Constants.Endpoints.PORTAL)
export class PortalRoutes {

    static MAX_SESSION_SIZE = 10;
    constructor() { }

    @Post(Constants.Endpoints.LOGIN, validate(CredentialsPayload), validate(DeviceUUIDHeaderValidator, 'headers'))
    public async login(req: Request) {
        // TODO: send an email to user to notify him about login attempt.

        const { username, password } = cast<CredentialsPayload>(req.body);
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);

        const { data: user, ...result } = await usersService.one({ username }, {
            projection: {
                password: 1,
                role: 1
            }
        });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        const isPasswordEqual = HashService.comparePassword(password, user.password);
        if (AppUtils.isFalsy(isPasswordEqual)) {
            return new Responses.BadRequest('wrong_credintals');
        }
        const activeUserSessions = await sessionsService.getActiveUserSession(user.id);
        if (activeUserSessions.data.length >= PortalRoutes.MAX_SESSION_SIZE) {
            return new Responses.BadRequest('exceeded_allowed_sesison');
        }
        await sessionsService.create({
            device_uuid,
            active: true,
            user: user.id
        });
        return new Responses.Ok(new LoginDto(user.id, user.role, user.verified));

    }

    @Post(Constants.Endpoints.LOGOUT, validate(DeviceUUIDHeaderValidator, 'headers'))
    public async logout(req: Request) {
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);
        const result = await sessionsService.deActivate({ device_uuid });
        if (result.hasError) {
            return new Responses.BadRequest();
        }
        return new Responses.Ok(result.data);
    }

    @Post(
        Constants.Endpoints.REFRESH_TOKEN,
        validate(DeviceUUIDHeaderValidator, 'headers'),
        validate(RefreshTokenPayload)
    )
    public async refreshToken(req: Request) {
        const { token, refreshToken } = cast<RefreshTokenPayload>(req.body);
        const device_uuid = req.header(ApplicationConstants.deviceIdHeader);
        try {
            const decodedRefreshToken = await tokenService.decodeToken<IRefreshTokenClaim>(refreshToken);
            try {
                await tokenService.decodeToken(token);
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    const session = await sessionsService.getActiveSession({
                        device_uuid,
                        user: decodedRefreshToken.id
                    });

                    if (session.hasError) {
                        return new Responses.BadRequest();
                    }
                    const { data: user } = await usersService.one({ _id: decodedRefreshToken.id });

                    await sessionsService.updateById(session.data.id, { updatedAt: new Date().toISOString() });
                    return new Responses.Ok(new RefreshTokenDto(user.id, user.role, user.verified));
                }
            }
        } catch (error) {
            await sessionsService.deActivate({ device_uuid });
        }
        return new Responses.BadRequest();
    }

    @Post(
        Constants.Endpoints.ACCOUNT_VERIFIED,
        validate(AccountVerifiedPayload, 'body', 'Please make sure you have entered the correct information payload.')
    )
    public async accountVerifed(req: Request) {
        const payload = cast<AccountVerifiedPayload>(req.body);
        const result = await usersService.one({
            'username': payload.username,
            'profile.firstName': payload.firstName,
            'profile.lastName': payload.lastName,
            'profile.placeOfBirth': payload.placeOfBirth,
        });
        if (result.hasError) {
            return new Responses.BadRequest('Please make sure you have entered the correct information.');
        }
        const { emailVerified, mobileVerified } = result.data;
        if (emailVerified) {
            return new Responses.Ok({ emailVerified, mobileVerified });
        } else {
            return new Responses.BadRequest('You cannot reset you password because your account it not verified yet, please contact the adminstration for further actions');
        }
    }

    @Post(Constants.Endpoints.SEND_RESET_PINCODE_EMAIL, validate(EmailValidator))
    public async sendResetPasswordEmail(req: Request) {
        const { email } = req.body;
        const result = await usersService.one({ email });
        if (result.hasError) {
            return new Responses.BadRequest('It appears the email is not registerd before');
        }
        const pincode = PortalHelper.generatePinCode();
        pincodes.set(email, new Pincode(pincode));
        EmailService.sendPincodeEmail(result.data.email, pincode);
        return new SuccessResponse('An e-mail sent to your inbox with additional information');
    }

    @Post(Constants.Endpoints.CHECK_PINCODE, validate(PincodeValidator))
    public async checkPincode(req: Request) {
        const payload = cast<PincodeValidator>(req.body);
        const expectedPincode = pincodes.get(payload.email);
        if (
            expectedPincode &&
            !AppUtils.isDateElapsed(expectedPincode.ttl)
            && payload.pincode === expectedPincode.pincode
        ) {
            return new Responses.Ok(null);
        }
        return new Responses.BadRequest('Wrong pincode, please try again');
    }

    @Post(Constants.Endpoints.RESET_PASSWORD)
    public async resetPassword(req: Request, res: Response) {
        const { password } = req.body as Payload<UsersSchema>;
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        await usersService.updateById(decodedToken.id, { password });
        const response = new Responses.Ok(null);
        await EmailService.sendEmail(fakeEmail());
        res.status(response.code).json(response);
    }

    @Get(Constants.Endpoints.VERIFY_EMAIL)
    public async updateUserEmailVerification(req: Request, res: Response) {
        const { token } = req.query;
        const decodedToken = await tokenService.decodeToken(token);
        const result = await usersService.updateById(decodedToken.id, { emailVerified: true });
        if (result.hasError) {
            return new Responses.BadRequest('Please try again later');
        }
        res.redirect('http://localhost:4200/portal/login');
    }

}

// TODO remove expired pincodes
scheduleJob('30 * * * *', async () => {
    const sessions = await sessionsService.getAllActiveSession();
    sessions.data.list.forEach((session) => {
        // if the active session updatedAt is late by 12 that's means that this session is no
        // longer used and should be turned of
        // TODO deActivate useless sessions
    });
});

// TODO: Forget and reset password scenario
// Enter a unique info like partial of profile info page 1
// Security questions page 2
// send an email with generated number to be entered later on in page 3
// Lock the account after 3 times of trying
// send an email to notify the user that the email is changed
// Only previous registerd devices can be used to do forgot password;

// REVIEW if anyone get the token can change the user password,
// so we need to know that the user who really did that by answering a specifc questions, doing 2FA
// the attempts should be limited to 3 times, after that he need to re do the process again,
// if the procces faild 3 times, the account should be locked, and he need to call the support for that

// TODO already used refresh token shouldn't be used again
