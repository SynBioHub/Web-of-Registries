var sha1 = require('sha1');

import { Request, Response } from 'express';
import { User, UserInstance } from '../lib/db';
import { Config } from '../lib/config';
import * as pug from 'pug';

function users(req: Request, res: Response) {
    if (req.method == "POST") {
        post(req, res);
    } else {
        view(req, res);
    }

}

function view(req: Request, res: Response) {
    let config = new Config();

    User.findAll()
        .then(users => {
            let locals = {
                config: config.get(),
                section: 'login',
                user: req.session.user,
                users: users || [],
            };

            res.send(pug.renderFile('src/templates/views/users.jade', locals))
        })
}

function post(req: Request, res: Response) {
    if (req.body.id) {
        update(req, res);
    } else {
        create(req, res);
    }
}

function update(req: Request, res: Response) {
    let config = new Config();

    User.findById(req.body.id).then(user => {
        if (user != null) {
            user.email = req.body.email;

            if (req.body.password) {
                user.password = sha1(config.get('passwordSalt') + sha1(req.body.password));
            }

            user.save().then(user => {
                res.redirect('/users/');
            })
        }
    })
}

function create(req: Request, res: Response) {
    let config = new Config();

    User.create({
        email: req.body.email,
        password: sha1(config.get('passwordSalt') + sha1(req.body.password))
    }).then(user => {
        req.session.save(() => {
            res.redirect('/users/');
        })

    })
}

export {
    users
}
