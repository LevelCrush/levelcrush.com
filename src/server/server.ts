import * as express from 'express';
import * as ExpressSession from 'express-session';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';

import ENV from '../env';
import * as https from 'https';
import * as fs from 'fs';

// passports

import session = require('express-session');

export interface ServerRequest extends express.Request {
    globals: {
        platforms: {};
    };
}

export class Server {
    public app: express.Express;
    private port: number = 8080;
    private httpsServer: https.Server | undefined;

    public constructor(
        engine: string,
        views: string,
        ssl?: {
            key: string;
            cert: string;
        },
    ) {
        // create our express app
        this.app = express();

        // set pug as our view engine
        this.app.set('view engine', engine);
        this.app.set('views', views);
        this.app.locals.basedir = views;

        let enableSSL = ssl !== undefined;
        if (ssl !== undefined) {
            this.httpsServer = https.createServer(
                {
                    key: fs.readFileSync(ssl.key),
                    cert: fs.readFileSync(ssl.cert),
                },
                this.app,
            );
        }

        // configure body parsing
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    public static(route: string, path: string) {
        this.app.use(route, express.static(path));
    }

    public router(route: string, router: express.Router) {
        console.log('Using Route: ' + route);
        this.app.use(route, router);
    }

    public start(port = 8080) {
        // on start add this wildcard route to catch anything else
        this.app.use((req, res) => {
            res.sendStatus(404);
        });

        this.port = port;
        return new Promise(() => {
            if (this.httpsServer !== undefined) {
                this.httpsServer.listen(this.port, () => {
                    console.log('Doing something on ' + this.port);
                });
            } else {
                this.app.listen(this.port, () => {
                    console.log('Now listening on ' + this.port);
                });
            }
        });
    }
}

export default Server;
