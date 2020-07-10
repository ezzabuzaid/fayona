import { Router, HttpGet, Post } from '@lib/restful';
import { Request } from 'express';
import { locateModel } from '@lib/mongoose';
import { SettingSchema } from './settings.model';

@Router('settings')
export class SettingRoutes {

    @HttpGet()
    async getSettings() {
        const document = await locateModel(SettingSchema).findOne();
        return document.settings || {};
    }

    @Post('/:name')
    async saveSettings(req: Request) {
        const { name } = req.params;
        const document = await locateModel(SettingSchema).findOne();
        document.settings[name] = req.body;
        await document.save();
        return name;
    }

    @HttpGet('/:name')
    async getSetting(req: Request) {
        const { name } = req.params;
        const document = await locateModel(SettingSchema).findOne();
        return document.settings[name];
    }

}
