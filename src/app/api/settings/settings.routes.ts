import { Router, Get, Post } from '@lib/methods';
import { Request } from 'express';
import settingsModel from './settings.model';

@Router('settings')
export class SettingRoutes {

    @Get()
    async getSettings() {
        const document = await settingsModel.findOne();
        return document.settings || {};
    }

    @Post('/:name')
    async saveSettings(req: Request) {
        const { name } = req.params;
        const document = await settingsModel.findOne();
        document.settings[name] = req.body;
        await document.save();
        return name;
    }

    @Get('/:name')
    async getSetting(req: Request) {
        const { name } = req.params;
        const document = await settingsModel.findOne();
        return document.settings[name];
    }

}
