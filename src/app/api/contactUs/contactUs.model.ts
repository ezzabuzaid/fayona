import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { ValidationPatterns } from '@shared/common';

@Entity(Constants.Schemas.ContactUs)
export class ContactUsSchema {
    @Field() public name: string;
    @Field({
        match: [ValidationPatterns.EmailValidation, 'Please provide a valid email address'],
    }) public email: string;
    @Field() public enquiry: string;
    @Field() public message: string;
}

export const ContactUsModel = BaseModel<ContactUsSchema>(ContactUsSchema);
