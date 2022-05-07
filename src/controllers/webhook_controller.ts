import { ServerController, ServerResponse, ServerResponseError } from '../server/server_controller';
import * as moment from 'moment';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import ENV from '../env';
import { RaidGuideManager, RaidGuide } from '../api/raid_guide';
import axios from 'axios';

export class WebHookController extends ServerController {
    static isImporting = false;
    public constructor() {
        super('/webhook');

        WebHookController.isImporting = false;
        this.router.post('/job/raidguide/votd', this.postRaidGuideVOTD);
    }

    public async postRaidGuideVOTD(req: express.Request, response: express.Response) {
        let serverResponse = {
            success: true,
            response: {} as { [key: string]: unknown },
            errors: [] as string[],
        };

        let form = req.body as {
            token?: string;
            token_secret?: string;
        };

        if (WebHookController.isImporting === true) {
            serverResponse.success = false;
            serverResponse.errors.push('Already Running');
        } else {
            WebHookController.isImporting = true;
            let appToken = form.token !== undefined ? form.token.trim() : '';
            let appTokenSecret = form.token_secret !== undefined ? form.token_secret.trim() : '';
            const axiosResponse = await axios.post(ENV.hosts.api + '/application/verify', {
                token: appToken,
                token_secret: appTokenSecret,
            });

            let isCallerValid = false;
            if (axiosResponse.data) {
                const apiResponse = axiosResponse.data as {
                    success: boolean;
                    response: {
                        verified: boolean;
                        timestamp: number;
                    };
                    errors: string[];
                };

                isCallerValid = apiResponse.response.verified;
            }

            if (isCallerValid) {
                let raidguide = new RaidGuideManager('votd');

                console.log('Pulling raid guide from api');
                await raidguide.pull();

                console.log('Pre rendering and downloading assets');
                await Promise.all([raidguide.prerender(), raidguide.downloadGuideAssets()]);
            }

            WebHookController.isImporting = false;
        }

        serverResponse.response['timestamp'] = moment().unix();
        response.send(serverResponse);
    }
}

export default WebHookController;
