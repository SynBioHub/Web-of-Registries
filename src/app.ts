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
import { update } from './api/update';
import { detail } from './api/detail';


function app(): express.Express {
    let app = express();

    app.get('/instances/', list);
    app.get('/instances/:instanceId/', detail)

    app.post('/instances/new/', register);

    app.delete('/instances/:instanceId/', remove);
    
    app.patch('/instances/:instanceId/', update);

    return app;
}

export {
    app
};