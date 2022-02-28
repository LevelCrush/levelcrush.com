import ENV from './env';

import Server from './server/server';

import ServerController from './server/server_controller';
import PageController from './controllers/PageController';
import * as path from 'path';

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
    );
    var assetPath =
        ENV.server !== undefined && ENV.server.assets !== undefined ? ENV.server.assets : 'please supply static path';
    console.log('The following is the asset path: ', assetPath);
    server.static('/assets', assetPath);
    server.static('/robots.txt', path.join(assetPath, 'root', 'robots.txt'));
    server.static('/robot.txt', path.join(assetPath, 'root', 'robots.txt'));

    server.static('/', path.join(assetPath, 'root'));

    let controllers: ServerController[] = [new PageController()];
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
