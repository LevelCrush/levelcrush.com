import { ServerController, ServerResponse, ServerResponseError } from '../server/server_controller';
import * as moment from 'moment';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import ENV from '../env';

export class PageController extends ServerController {
    public constructor() {
        super('/');

        this.router.get('/', this.getHome);
        this.router.get('/lfg', this.getLFG);
        this.router.get('/feedback', this.getFeedback);
        this.router.get('/secret', this.getSecret);
    }

    public async getSecret(req: express.Request, response: express.Response) {
        let variables: { [key: string]: unknown } = {};
        let possibleSecrets = 0;
        variables['title'] = 'Secret';
        variables['hosts'] = ENV.hosts;
        variables['application'] = ENV.platforms.api.token;

        let viewDirectory = ENV.server && ENV.server.views ? ENV.server.views : '';
        if (viewDirectory !== '') {
            fs.readdir(path.join(viewDirectory, 'secrets'), { encoding: 'utf-8' }, (err, files) => {
                possibleSecrets = files.length;
                // generate random number
                // based off : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
                const min = Math.ceil(0);
                const max = Math.floor(possibleSecrets);
                let randomNumber = Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and
                randomNumber = Math.max(randomNumber, min);
                randomNumber = Math.min(randomNumber, max);
                response.render('secrets/' + files[randomNumber], variables);
            });
        } else {
            // if we do not have a view directory for some reason
            // take a best guess and hope for the best
            response.redirect('/'); // go back to the home page
        }
    }

    public async getHome(req: express.Request, response: express.Response) {
        let variables: { [key: string]: unknown } = {};
        variables['title'] = 'Home | Level Crush';
        variables['hosts'] = ENV.hosts;
        variables['application'] = ENV.platforms.api.token;
        response.render('pages/index', variables);
    }

    public async getLFG(req: express.Request, response: express.Response) {
        let variables: { [key: string]: unknown } = {};
        variables['title'] = 'LFG Application | Level Crush';
        variables['hosts'] = ENV.hosts;
        variables['application'] = ENV.platforms.api.token;
        response.render('pages/lfg', variables);
    }

    public async getFeedback(req: express.Request, response: express.Response) {
        let variables: { [key: string]: unknown } = {};

        variables['title'] = 'Feedback Form | Level Crush';
        variables['hosts'] = ENV.hosts;
        variables['application'] = ENV.platforms.api.token;
        response.render('pages/feedback', variables);
    }
}

export default PageController;
