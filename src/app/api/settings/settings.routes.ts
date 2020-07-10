import { Route, HttpGet, HttpPost } from '@lib/restful';
import { Request } from 'express';
import { locateModel } from '@lib/mongoose';
import { SettingSchema } from './settings.model';

@Route('settings')
export class SettingRoutes {

    @HttpGet()
    async getSettings() {
        const document = await locateModel(SettingSchema).findOne();
        return document.settings || {};
    }

    @HttpPost('/:name')
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
