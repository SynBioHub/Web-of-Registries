/* SynBioHub Federator
 * Web of Registries
 *
 * Configuration edit page
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

var sha1 = require('sha1');

import { Request, Response } from 'express';
import { Config } from '../lib/config';
import * as pug from 'pug';

function config(req: Request, res: Response) {
    if (req.method == "POST") {
        post(req, res);
    } else {
        view(req, res);
    }

}

function view(req: Request, res: Response) {
    let config = new Config();

    let parameters = Object.keys(config.get()).map(function (key: string) {
        return {
            name: key,
            value: config.get(key)
        }
    });

    let locals = {
        config: config.get(),
        section: 'login',
        user: req.session.user,
        parameters: parameters,
    };

    res.send(pug.renderFile('src/templates/views/config.jade', locals))
}

function post(req: Request, res: Response) {
    let config = new Config();

    Object.keys(req.body).forEach(key => {
        config.set(key, req.body[key]);
    })

    console.log('redirectiong')

    res.redirect('/config/');
}

export {
    config
}
