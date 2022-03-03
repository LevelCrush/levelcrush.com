import { ServerController, ServerResponse, ServerResponseError } from '../server/server_controller';
import * as moment from 'moment';
import * as express from 'express';
import ENV from '../env';

export class PageController extends ServerController {
    public constructor() {
        super('/');

        this.router.get('/', this.getHome);
        this.router.get('/lfg', this.getLFG);
        this.router.get('/feedback', this.getFeedback);
    }

    public async getHome(req: express.Request, response: express.Response) {
        let variables: { [key: string]: unknown } = {};
        variables['title'] = 'Home | Level Crush';
        variables['hosts'] = ENV.hosts;
        response.render('pages/index', variables);
    }

    public async getLFG(req: express.Request, response: express.Response) {
        let variables: { [key: string]: unknown } = {};
        variables['title'] = 'LFG Application | Level Crush';
        variables['hosts'] = ENV.hosts;
        response.render('pages/lfg', variables);
    }

    public async getFeedback(req: express.Request, response: express.Response) {
        let variables: { [key: string]: unknown } = {};

        variables['title'] = 'Feedback Form | Level Crush';
        variables['hosts'] = ENV.hosts;
        response.render('pages/feedback', variables);
    }
}

export default PageController;
