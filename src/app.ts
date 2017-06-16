/* SynBioHub Federator
 * Web of Registries
 *
 * Application server
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { SynBioHub } from './lib/db';
import { list } from './api/list';
import { register } from './api/register';
import { remove } from './api/remove';
import { update } from './api/update';
import { detail } from './api/detail';


function app(): express.Express {
    let app = express();

    app.get('/instances/', list);
    app.get('/instances/:instanceId/', detail)

    app.post('/instances/new/', bodyParser.json(), register);

    app.delete('/instances/:instanceId/', bodyParser.json(), checkUpdateSecret, remove);

    app.patch('/instances/:instanceId/', bodyParser.json(), checkUpdateSecret, update);

    return app;
}

function checkUpdateSecret(req: Request, res: Response, next: Function) {
    let id = req.params.instanceId;

    SynBioHub.findById(id).then(synbiohub => {
        if(synbiohub === null) {
            res.sendStatus(404);
        } else if (synbiohub.updateSecret === req.body.updateSecret) {
            next();
        } else {
            res.sendStatus(403);
        }
    })
}

export {
    app
};