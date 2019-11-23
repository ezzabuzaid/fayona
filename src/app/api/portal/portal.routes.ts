import { ErrorResponse, NetworkStatus, SuccessResponse, tokenService, Constants } from '@core/helpers';
import { Post, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import usersService from '@api/users/users.service';
import { UsersSchema } from '@api/users';
import { Body } from '@lib/mongoose';

// TODO: create the profile / account strategy

@Router(Constants.Endpoints.PORTAL)
export class PortalRoutes {

    @Post(`login`)
    public async login(req: Request, res: Response) {
        const { username, password } = req.body as Body<UsersSchema>;
        const entity = await usersService.one({ username });
        if (!!entity) {
            const isPasswordEqual = await entity.comparePassword(password);
            if (isPasswordEqual) {
                // TODO: replace the response with login response and not user info
                const response = new SuccessResponse(entity, translate('success'));
                response.token = tokenService.generateToken({
                    id: entity.id,
                    role: entity.role
                });
                return res.status(response.code).json(response);
            }
        }
        throw new ErrorResponse(translate('wrong_credintals'));
    }

    public async forgotPassword(req: Request, res: Response) {
        const { username } = req.body as Body<UsersSchema>;
        const entity = await throwIfNotExist({ username });
        // sendEmail(entity.email);
    }

}

async function throwIfNotExist(query: Partial<Body<UsersSchema>>) {
    const entity = await usersService.one(query);
    if (!!entity) {
        return entity;
    }
    throw new ErrorResponse(translate('not_exist'));
}

import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//     }
// });

// const message = {
//     from: 'ezzabuzaid@gmail.com',
//     to: 'ezzabuzaid@hotmail.com',
//     subject: 'Nodemailer is unicode friendly ✔',
//     text: 'Hello to myself!',
//     html: '<p><b>Hello</b> to myself!</p>'
// };

// transporter.sendMail(message, (err, info) => {
//     if (err) {
//         console.log('Error occurred. ' + err.message);
//         return process.exit(1);
//     }

//     console.log('Message sent: %s', info.messageId);
//     // Preview only available when sending through an Ethereal account
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// });
