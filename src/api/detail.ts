/* SynBioHub Federator
 * Web of Registries
 *
 * SynBioHub detail endpoint
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import { Request, Response } from 'express';
import { SynBioHub } from '../lib/db';

function detail(req: Request, res: Response) {
    SynBioHub.findById(req.params.instanceId).then(synbiohub => {
        if (synbiohub === null) {
            res.sendStatus(404);
        } else {
            let resultJson = JSON.stringify({
                id: synbiohub.get('id'),
                uriPrefix: synbiohub.get('uriPrefix'),
                instanceUrl: synbiohub.get('instanceUrl'),
                description: synbiohub.get('description'),
                name: synbiohub.get('name'),
                approved: synbiohub.get('approved'),
                administratorEmail: synbiohub.get('administratorEmail'),
                updateWorking: synbiohub.get('updateWorking')
            }, null, 4);

            res.send(resultJson);
        }
    });
}

export {
    detail
};