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
import { broadcast } from './approve';
import * as crypto from 'crypto';
import * as requests from 'request';

function register(req: Request, res: Response) {

    SynBioHub.create({
        uriPrefix: req.body.uriPrefix,
        instanceUrl: req.body.instanceUrl,
        administratorEmail: req.body.administratorEmail,
        updateEndpoint: req.body.updateEndpoint,
        name: req.body.name,
        description: req.body.description,
        updateSecret: crypto.randomBytes(48).toString('hex'),
        approved: false,
        updateWorking: false
    }).then(synbiohub => {
        let updateUrl = [synbiohub.instanceUrl, synbiohub.updateEndpoint].join('');
        broadcast();

        let resultJson = JSON.stringify({
            id: synbiohub.get('id'),
            name: synbiohub.get('name'),
            description: synbiohub.get('description'),
            uriPrefix: synbiohub.get('uriPrefix'),
            instanceUrl: synbiohub.get('instanceUrl'),
            updateSecret: synbiohub.get('updateSecret'),
            administratorEmail: synbiohub.get('administratorEmail'),
            updateEndpoint: synbiohub.get('updateEndpoint')
        }, null, 4);

        res.send(resultJson);
    }).catch(err => {
        res.status(400);
        res.send(err);
    });
}

export {
    register
};