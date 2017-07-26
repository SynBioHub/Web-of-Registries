/* SynBioHub Federator
 * Web of Registries
 *
 * Logout action
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import { Request, Response } from 'express';

function logout(req: Request, res: Response) {

    if (req.session.user !== undefined)
        delete req.session.user
    req.session.save(() => {
        res.redirect('/');
    })
};

export {
    logout
}