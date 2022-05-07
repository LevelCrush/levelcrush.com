import { ServerController, ServerResponse, ServerResponseError } from '../server/server_controller';
import * as moment from 'moment';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import ENV from '../env';
import { RaidGuideManager, RaidGuide } from '../api/raid_guide';

export class GuideController extends ServerController {
    public constructor() {
        super('/guides');

        this.router.get('/destiny2/votd', this.getDestiny2VOTD);
    }

    public async getDestiny2VOTD(req: express.Request, response: express.Response) {
        let variables = super.getBaseVariables(req);
        variables['title'] = 'Guides';

        const timerStart = Date.now();
        // inbetween
        let doHardPull = false;
        if (ENV.server && ENV.server.assets && ENV.server.guideCache) {
            const cachePath = path.join(ENV.server.guideCache, 'raidguide_votd.json');
            let fileDoesExist = false;
            try {
                await fs.promises.access(cachePath);
                fileDoesExist = true;
            } catch {
                fileDoesExist = false;
            }

            if (fileDoesExist) {
                variables['guide'] = JSON.parse(await fs.promises.readFile(cachePath, { encoding: 'utf-8' }));
            } else {
                doHardPull = true;
            }
        }

        if (doHardPull) {
            let raidGuide = new RaidGuideManager('votd');
            await raidGuide.pull();
            await raidGuide.prerender();
            variables['guide'] = raidGuide.raw() as RaidGuide;
        }

        const timerEnd = Date.now();
        variables['duration'] = timerEnd - timerStart;

        response.render('guides/destiny2/votd', variables);
    }
}

export default GuideController;
