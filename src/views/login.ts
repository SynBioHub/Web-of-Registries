
var sha1 = require('sha1');

import { Request, Response } from 'express';
import { User, UserInstance } from '../lib/db';
import { Config } from '../lib/config';
import * as extend from 'xtend';
import * as pug from 'pug';

function login(req: Request, res: Response) {
    if (req.method === 'POST') {
        loginPost(req, res)
    } else {
        loginForm(req, res, {})
    }
}

function loginForm(req: Request, res: Response, locals: Object) {

    let config = new Config();

    if (req.body && req.body.user) {

        return res.redirect(req.query.next || '/');

    }

    User.findAndCountAll().then(result => {
        locals = extend({
            config: config.get(),
            section: 'login',
            nextPage: req.query.next || '/',
            loginAlert: null,
            user: req.body && req.body.user ? req.body.user : undefined,
            usersExist: result.count > 0
        }, locals)

        res.send(pug.renderFile('src/templates/views/login.jade', locals))
    })
}

function loginPost(req: Request, res: Response) {

    let config = new Config();

    if (!req.body.email || !req.body.password) {
        return loginForm(req, res, {
            form: req.body,
            loginAlert: 'Please enter your e-mail address and password.'
        })
    }

    var passwordHash = sha1(config.get('passwordSalt') + sha1(req.body.password));

    User.findAndCountAll().then(result => {
        if (result.count > 0) {
            User.findOne({
                where: {
                    email: req.body.email
                }

            }).then(user => {

                if (!user || passwordHash !== user.password) {
                    return loginForm(req, res, {
                        form: req.body,
                        loginAlert: 'Your e-mail address or password was incorrect.',
                        next: req.body.next
                    })
                }

                req.session.user = user;

                req.session.save(() => {
                    res.redirect('/');
                })

            })
        } else {
            User.create({
                email: req.body.email,
                password: passwordHash
            }).then(user => {
                req.session.user = user;

                req.session.save(() => {
                    res.redirect('/');
                })

            })
        }
    })
}

export {
    login
};
