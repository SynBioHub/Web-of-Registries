/* SynBioHub Federator
 * Web of Registries
 *
 * Application server
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import * as express from 'express';
import { list } from './api/list';
import { register } from './api/register';
import { remove } from './api/remove';
import { update } from './api/update'


function app(): express.Express {
    let app = express();

    app.get('/list/', list);
    app.post('/register/', register);
    app.delete('/remove/', remove);
    app.patch('/update/', update);

    return app;
}

export {
    app
};