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
import * as cors from 'cors';
import { Request, Response } from 'express';

// Import view functions
import { Config } from './lib/config';
import { SynBioHub, User, sequelize } from './lib/db';
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
import { deleteUser } from './views/deleteUser';
import { config as configView } from './views/config';

const SequelizeStore = require('connect-sequelize')(session);


function app(): express.Express {
    let config = new Config();
    let app = express();

    // Set up session store
    app.use(session({
        secret: config.get('sessionSecret').toString(),
        resave: false,
        saveUninitialized: false,
        store: new SequelizeStore(sequelize, {}, 'Session')
    }));

    app.use(cors());

    // API Endpoints
    app.get('/instances/', list);

    app.delete('/instances/:instanceId/', bodyParser.json(), checkUpdateSecret, remove);
    app.get('/instances/:instanceId/', detail)
    app.patch('/instances/:instanceId/', bodyParser.json(), checkUpdateSecret, update);

    app.post('/instances/new/', bodyParser.json(), register);


    // Web of Registries Views and Actions
    app.get('/', requireUser, requests);
    app.post('/', requireUser, bodyParser.urlencoded({ extended: true }), requests);

    app.get('/config/', requireUser, configView);
    app.post('/config/', requireUser, bodyParser.urlencoded({ extended: true }), configView);

    app.get('/instances/:instanceId/approve/', requireUser, approve);

    app.get('/instances/:instanceId/delete/', requireUser, remove);

    app.get('/instances/:instanceId/reject/', requireUser, remove);

    app.get('/login', login);
    app.post('/login', bodyParser.urlencoded({ extended: true }), login);

    app.get('/logout/', requireUser, logout);

    app.get('/registries/', requireUser, registries);

    app.get('/users/', requireUser, users);
    app.post('/users/', requireUser, bodyParser.urlencoded({ extended: true }), users);

    app.get('/users/:userId/delete/', requireUser, deleteUser);
    app.post('/users/:userId/delete/', requireUser, bodyParser.urlencoded({ extended: true }), deleteUser);

    return app;
}

// Verify that the correct update secret was sent
function checkUpdateSecret(req: Request, res: Response, next: Function) {
    let id = req.params.instanceId

    console.log(req.get('updateSecret'))

    // Find the relevant of SynBioHub
    SynBioHub.findById(id).then(synbiohub => {
        if (synbiohub === null) {
            // If we can't find it, send 404
            res.sendStatus(404);
        } else if (synbiohub.updateSecret === req.body.updateSecret) {
            // If we could find it, and the secret matches, all good
            next();
        } else if(synbiohub.updateSecret === req.get('updateSecret')) {
            // Also check the URL params for the update secret
            next();
        } else if (req.session.user === undefined) {
            // If we found the SynBioHub and there was no update secret or it didn't match,
            // and if there is no user logged in, send 403
            res.sendStatus(403);
        } else {
            // If a user is logged in, they have all priveleges
            next();
        }
    })
}

// Make sure a user is logged in
function requireUser(req: Request, res: Response, next: Function) {

    if (req.session.user === undefined) {
        res.redirect('/login?next=' + encodeURIComponent(req.url))
    } else {
        next();
    }
}


export {
    app
};