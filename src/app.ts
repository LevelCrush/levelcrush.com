process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import ENV from './env';
import Server from './server/server';
import ServerController from './server/server_controller';
import PageController from './controllers/page_controller';
import * as path from 'path';
import GuideController from './controllers/guide_controller';
import WebHookController from './controllers/webhook_controller';

async function main(): Promise<void> {
    console.log('Starting database');
    /*
    let database = new Database();
    await database.connect();
    */

    console.log('Starting Server');
    // let server = new Server(database);
    let server = new Server(
        ENV.server && ENV.server.engine ? ENV.server.engine : '',
        ENV.server && ENV.server.views ? ENV.server.views : '',
        ENV.server && ENV.server.ssl && ENV.server.ssl ? ENV.server.ssl : undefined,
    );
    var assetPath =
        ENV.server !== undefined && ENV.server.assets !== undefined ? ENV.server.assets : 'please supply static path';
    console.log('The following is the asset path: ', assetPath);
    server.static('/assets', assetPath);
    server.static('/robots.txt', path.join(assetPath, 'root', 'robots.txt'));
    server.static('/robot.txt', path.join(assetPath, 'root', 'robots.txt'));

    server.static('/', path.join(assetPath, 'root'));

    let controllers: ServerController[] = [new PageController(), new GuideController(), new WebHookController()];
    controllers.forEach((controller, index) => {
        server.router(controller.route, controller.router);
    });

    let awaitingPromises: Promise<unknown>[] = [];

    // start the server
    console.log('Starting server');
    awaitingPromises.push(server.start(ENV.server?.port));
    await Promise.all(awaitingPromises);
}

main()
    .then(() => console.log('Done'))
    .catch((err) => console.log('An error occurred', err));
