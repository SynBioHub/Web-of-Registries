/* SynBioHub Federator
 * Web of Registries
 *
 * SynBioHub registration endpoint
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import { Request, Response } from 'express';
import { SynBioHub } from '../lib/db';
import * as crypto from 'crypto';

function register(req: Request, res: Response) {
    SynBioHub.create({
        uriPrefix: req.body.uriPrefix,
        instanceUrl: req.body.instanceUrl,
        updateSecret: crypto.randomBytes(48).toString('hex')
    }).then(synbiohub => {
        let resultJson = JSON.stringify({
                id: synbiohub.get('id'),
                uriPrefix: synbiohub.get('uriPrefix'),
                instanceUrl: synbiohub.get('instanceUrl'),
                updateSecret: synbiohub.get('updateSecret')
            }, null, 4);

        res.send(resultJson);
    }).catch(err => {
        res.status(400);
        res.send(err)
    });
}

export {
    register
};