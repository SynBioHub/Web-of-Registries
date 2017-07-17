/* SynBioHub Federator
 * Web of Registries
 *
 * Application server
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { Config } from './lib/config';
import { SynBioHub, User } from './lib/db';
import { list } from './api/list';
import { register } from './api/register';
import { remove } from './api/remove';
import { update } from './api/update';
import { detail } from './api/detail';
import { approve } from './api/approve';
import { login } from './views/login';
import { requests } from './views/requests';
import { registries } from './views/registries';
import { users } from './views/users';
import { logout } from './views/logout';


function app(): express.Express {
    let config = new Config();
    let app = express();

    app.use(session({
        secret: config.get('sessionSecret').toString(),
        resave: false,
        saveUninitialized: false,
    }));

    app.get('/instances/', list);
    app.get('/instances/:instanceId/', detail)

    app.get('/login', login);
    app.post('/login', bodyParser.urlencoded({ extended: true }), login);

    app.get('/', requireUser, requests);
    app.post('/', requireUser, bodyParser.urlencoded({ extended: true }), requests);

    app.post('/instances/new/', bodyParser.json(), register);

    app.delete('/instances/:instanceId/', bodyParser.json(), checkUpdateSecret, remove);

    app.patch('/instances/:instanceId/', bodyParser.json(), checkUpdateSecret, update);

    app.get('/instances/:instanceId/approve/', requireUser, approve);

    app.get('/instances/:instanceId/reject/', requireUser, remove);

    app.get('/instances/:instanceId/delete/', requireUser, remove);

    app.get('/registries/', requireUser, registries);

    app.get('/users/', requireUser, users);
    app.post('/users/', requireUser, bodyParser.urlencoded({ extended: true }), users)

    app.get('/logout/', requireUser, logout);

    return app;
}

function checkUpdateSecret(req: Request, res: Response, next: Function) {
    let id = req.params.instanceId

    SynBioHub.findById(id).then(synbiohub => {
        if (synbiohub === null) {
            res.sendStatus(404);
        } else if (synbiohub.updateSecret === req.body.updateSecret) {
            next();
        } else if (req.session.user === undefined) {
            res.sendStatus(403);
        } else {
            next();
        }
    })
}

function requireUser(req: Request, res: Response, next: Function) {

    if (req.session.user === undefined)
        res.redirect('/login?next=' + encodeURIComponent(req.url))
    else
        next()
}


export {
    app
};