/* SynBioHub Federator
 * Web of Registries
 *
 * SynBioHub removal endpoint
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import { SynBioHub } from '../lib/db';
import { Request, Response } from 'express'

function remove(req: Request, res: Response) {
    SynBioHub.findById(req.params.instanceId).then(synbiohub => {
        if(synbiohub === null) {
            res.sendStatus(404);
        } else {
            synbiohub.destroy()
            

            if (req.session.user) {
                res.redirect('/');
            } else {
                res.sendStatus(200);
            }
        }
    });
}

export {
    remove
};