import { sessionsService } from '@api/sessions/sessions.service';
import usersService from '@api/users/users.service';
import { ApplicationConstants } from '@core/constants';
import { Constants, HashService } from '@core/helpers';
import { Responses, SuccessResponse } from '@core/response';
import { AppUtils, cast } from '@core/utils';
import { PrimaryKey } from '@lib/mongoose';
import { Get, Post, Router } from '@lib/restful';
import { PasswordValidator, PrimaryIDValidator, TokenValidator, validate } from '@shared/common';
import { EmailService } from '@shared/email';
import { identity, IRefreshTokenClaim, tokenService } from '@shared/identity';
import { NodeServer } from 'app/server';
import { IsEmail, IsIn, IsJWT, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { scheduleJob } from 'node-schedule';
import { PortalHelper } from './portal.helper';

class Pincode {
    public ttl = AppUtils.duration(5);
    constructor(
        public pincode: string
    ) { }
}

/**
 * a Map consist of key-value pair of user id and pincode
 */
const pincodes = new Map<PrimaryKey, Pincode>();

export class SendPincodeValidator {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    mobile: string = null;

    @IsEmail()
    @IsOptional()
    email: string = null;

    @IsMongoId() id: PrimaryKey = null;

    @IsString()
    @IsNotEmpty()
    @IsIn(['email', 'sms'])
    type: 'email' | 'sms' = null;
}

export class CheckPincodeValidator extends PrimaryIDValidator {
    @IsNotEmpty()
    @IsString()
    pincode: string = null;
}

// export class ResetPasswordValidator extends PrimaryIDValidator {
//     @IsNotEmpty()
//     @IsString()
//     pincode: string = null;
// }

export class AccountVerificationPayload {
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
        return new Responses.Ok(new LoginDto(user.id, user.role, user.emailVerified));

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
                    return new Responses.Ok(new RefreshTokenDto(user.id, user.role, user.emailVerified));
                }
            }
        } catch (error) {
            await sessionsService.deActivate({ device_uuid });
        }
        return new Responses.BadRequest();
    }

    @Post(
        Constants.Endpoints.ACCOUNT_VERIFIED,
        validate(AccountVerificationPayload, 'body', 'Please make sure you have entered the correct information payload.')
    )
    public async accountVerifed(req: Request) {
        const payload = cast<AccountVerificationPayload>(req.body);
        const result = await usersService.one({
            'username': payload.username,
            'profile.firstName': payload.firstName,
            'profile.lastName': payload.lastName,
            'profile.placeOfBirth': payload.placeOfBirth,
        });
        if (result.hasError) {
            return new Responses.BadRequest('Please make sure you have entered the correct information.');
        }
        const { emailVerified, mobileVerified, id } = result.data;
        if (emailVerified) {
            return new Responses.Ok({ emailVerified, mobileVerified, id });
        } else {
            return new Responses.BadRequest('You cannot reset you password because your account it not verified yet, please contact the adminstration for further actions');
        }
    }

    @Post(Constants.Endpoints.SEND_PINCODE, validate(SendPincodeValidator))
    public async sendPincode(req: Request) {
        const { email, mobile, type, id } = cast<SendPincodeValidator>(req.body);
        const pincode = PortalHelper.generatePinCode();
        if (type === 'email') {
            const result = await usersService.one({ email });
            if (AppUtils.not(result.hasError)) {
                EmailService.sendPincodeEmail(email, pincode);
            }
        } else {
            const result = await usersService.one({ mobile });
            if (AppUtils.not(result.hasError)) {
                // Send sms
            }
        }
        pincodes.set(id, new Pincode(pincode));
        return new SuccessResponse(`${ type === 'email' ? 'An e-mail' : 'A SMS ' } message sent to your mobile with additional information`);
        // No error handling if the user is not exist
    }

    @Post(Constants.Endpoints.CHECK_PINCODE, validate(CheckPincodeValidator))
    public async checkPincode(req: Request) {
        const payload = cast<CheckPincodeValidator>(req.body);
        const expectedPincode = pincodes.get(payload.id);
        const { wrong, expired } = this.comparePincode(payload.pincode, expectedPincode);
        if (expired) {
            return new Responses.BadRequest('Pincode is not valid anymore, please try again latter');
        } else if (wrong) {
            return new Responses.BadRequest('Wrong pincode, please try again');
        }
        return new Responses.Ok(null);
    }

    private comparePincode(actuallPincode: string, expectedPincode: Pincode) {
        return {
            expired: AppUtils.isDateElapsed(expectedPincode?.ttl),
            wrong: actuallPincode !== expectedPincode.pincode
        };
    }

    @Post(
        Constants.Endpoints.RESET_PASSWORD,
        validate(PasswordValidator),
        validate(CheckPincodeValidator),
    )
    public async resetPassword(req: Request, res: Response) {
        const payload = cast<PasswordValidator & CheckPincodeValidator>(req.body);
        const expectedPincode = pincodes.get(payload.id);
        const { wrong, expired } = this.comparePincode(payload.pincode, expectedPincode);
        if (expired) {
            return new Responses.BadRequest('Pincode is not valid anymore, please try again later');
        } else if (wrong) {
            // if the pincode was wrong so he in wrong place so we need to redirect him away
            res.redirect('http://localhost:4200/portal/login');
        }
        pincodes.delete(payload.id);
        const result = await usersService.updateById(payload.id, { password: payload.password });
        if (result.hasError) {
            return new Responses.BadRequest('Please try again later');
        }
        await EmailService.sendResetPasswordEmail('user@email.com');
        return new Responses.Ok(null);
    }

    @Get(Constants.Endpoints.VERIFY_EMAIL, validate(TokenValidator, 'query'))
    public async updateUserEmailVerification(req: Request, res: Response) {
        const { token } = cast<TokenValidator>(req.query);
        const decodedToken = await tokenService.decodeToken(token);
        const result = await usersService.updateById(decodedToken.id, { emailVerified: true });
        if (result.hasError) {
            return new Responses.BadRequest('Please try again later');
        }
        res.redirect('http://localhost:4200/');
    }

    @Get(Constants.Endpoints.SEND_Verification_EMAIL, identity.isAuthenticated())
    public async sendVerificationEmail(req: Request) {
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const result = await usersService.one({ _id: decodedToken.id });
        if (result.hasError) {
            return new Responses.BadRequest('Please try again later');
        }
        EmailService.sendVerificationEmail(NodeServer.serverUrl(req), result.data.email, result.data.id);
        return new Responses.Ok('Email has been sent successfully');
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
// Lock the account after 3 times of trying
// Only previous registerd devices can be used to do forgot password;

// TODO already used refresh token shouldn't be used again
