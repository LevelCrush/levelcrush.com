import { ServerController, ServerResponse, ServerResponseError } from '../server/server_controller';
import * as moment from 'moment';
import * as express from 'express';

export class PageController extends ServerController {
    public constructor() {
        super('/');

        this.router.get('/', this.getHome);
    }

    public async getHome(req: express.Request, response: express.Response) {
        // todo
        response.render('index');
    }
}

export default PageController;
