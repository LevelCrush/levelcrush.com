import { ServerController, ServerResponse, ServerResponseError } from '../server/server_controller';
import moment from 'moment';
import express from 'express';
import fs from 'fs';
import path from 'path';
import ENV from '../env';
import ReactDOM from 'react-dom/server';
import { TestPage, TestPageProps } from '../templates/test';
import React from 'react';
import axios from 'axios';
import { LFGActivity } from '../templates/components/LFGFeed';

export class PageController extends ServerController {
    public constructor() {
        super('/');

        this.router.get('/', this.getHome);
        this.router.get('/lfg', this.getLFG);
        this.router.get('/feedback', this.getFeedback);
        this.router.get('/secret', this.getSecret);
        this.router.get('/guides', this.getGuides);
        this.router.get('/test-react', this.getTestReact);
    }

    public async getTestReact(req: express.Request, response: express.Response) {
        let variables = super.getBaseVariables(req);
        variables['title'] = 'React Test';

        // literally copy and pasted the requestFeed method and stripped out any unnncessary code
        let lfgs = await ((): Promise<LFGActivity[]> => {
            return new Promise((resolve) => {
                axios
                    .post(ENV.hosts.api + '/feed/get', {
                        application: ENV.platforms.api.application,
                        name: 'destiny-lfg',
                    })
                    .then((response) => {
                        const timeEnd = Date.now();
                        if (
                            response.data &&
                            typeof response.data['success'] !== undefined &&
                            response.data['success'] === true &&
                            typeof response.data['response']['feed'] !== 'undefined' &&
                            typeof response.data['response']['feed']['data'] !== 'undefined'
                        ) {
                            // todo
                            const activityFeedJSON = response.data['response']['feed']['data'];
                            let activityFeed: LFGActivity[] | undefined = undefined;
                            try {
                                activityFeed = JSON.parse(activityFeedJSON);
                                resolve(activityFeed as LFGActivity[]);
                            } catch {
                                console.log('Unable to parse JSON feed');
                                resolve([]);
                            }
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(() => {
                        resolve([]);
                    });
            });
        })();

        console.log(lfgs);

        response.render('react', variables, (err, html) => {
            response.send(
                html.replace(
                    '<div id="entry"></div>',
                    '<div id="entry">' +
                        ReactDOM.renderToString(
                            React.createElement(TestPage, {
                                lfgs: lfgs,
                            } as TestPageProps),
                        ) +
                        '</div>',
                ),
            );
        });
    }

    public async getGuides(req: express.Request, response: express.Response) {
        let variables = super.getBaseVariables(req);
        let possibleSecrets = 0;
        variables['title'] = 'Guides';

        response.render('pages/guides', variables);
    }

    public async getSecret(req: express.Request, response: express.Response) {
        let variables = super.getBaseVariables(req);
        let possibleSecrets = 0;
        variables['title'] = 'Secret';

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
        let variables = super.getBaseVariables(req);
        variables['title'] = 'Home | Level Crush';
        response.render('pages/index', variables);
    }

    public async getLFG(req: express.Request, response: express.Response) {
        let variables = super.getBaseVariables(req);
        variables['title'] = 'LFG Application | Level Crush';
        response.render('pages/lfg', variables);
    }

    public async getFeedback(req: express.Request, response: express.Response) {
        let variables = super.getBaseVariables(req);
        variables['title'] = 'Feedback Form | Level Crush';
        response.render('pages/feedback', variables);
    }
}

export default PageController;
