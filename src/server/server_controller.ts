import Server from './server';
import * as express from 'express';
import ENV from '../env';
import Cookies from 'universal-cookie';

export interface ServerResponseError {
    field: string;
    message: string;
}

export interface ServerResponse {
    success: boolean;
    response: {};
    errors: ServerResponseError[];
}

export abstract class ServerController {
    public router: express.Router;
    public readonly route: string;

    public constructor(route: string) {
        this.router = express.Router();
        this.route = route;
    }

    public getBaseVariables(req: express.Request): { [key: string]: unknown } {
        let theme = '';
        let cookieJar =
            typeof (req as any)['universalCookies'] !== 'undefined'
                ? ((req as any)['universalCookies'] as Cookies)
                : undefined;
        if (cookieJar !== undefined && cookieJar.get('theme')) {
            theme = cookieJar.get('theme');
        }
        return {
            title: 'Placeholder',
            hosts: ENV.hosts,
            application: ENV.platforms.api.token,
            theme: theme,
        };
    }
}

export default ServerController;
