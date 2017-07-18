var sha1 = require('sha1');

import { Request, Response } from 'express';
import { User, UserInstance } from '../lib/db';
import { Config } from '../lib/config';
import * as pug from 'pug';

function deleteUser(req: Request, res: Response) {
    if (req.method == "POST") {
        post(req, res);
    } else {
        view(req, res);
    }

}

function view(req: Request, res: Response) {
    let config = new Config();

    User.findById(req.params.userId)
        .then(user => {
            if (user !== null) {
                let locals = {
                    config: config.get(),
                    section: 'login',
                    user: req.session.user,
                    toDelete: user,
                };

                res.send(pug.renderFile('src/templates/views/confirmDelete.jade', locals))
            } else {
                res.sendStatus(404);
            }
        })
}

function post(req: Request, res: Response) {
    let config = new Config();

    User.findById(req.params.userId)
        .then(user => {
            if (user !== null) {
                user.destroy()
                    .then(() => {
                        res.redirect('/users')
                    })
            } else {
                res.sendStatus(404);
            }
        })
}

export {
    deleteUser
}
