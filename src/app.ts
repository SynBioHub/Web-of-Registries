/* SynBioHub Federator
 * Web of Registries
 *
 * Application server
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import * as express from 'express';

function app(): express.Express {
    let app = express();

    return app;
}

export {
    app
};