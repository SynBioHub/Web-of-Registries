/* SynBioHub Federator
 * Web of Registries
 *
 * SynBioHub list endpoint
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import { Request, Response } from 'express';
import { SynBioHub } from '../lib/db';

function list(req: Request, res: Response) {
    SynBioHub.findAll().then( synbiohubs => {
        let result = synbiohubs.map(synbiohub => {
            return {
                id: synbiohub.get('id'),
                uriPrefix: synbiohub.get('uriPrefix'),
                instanceUrl: synbiohub.get('instanceUrl')
            };
        })

        let resultJson = JSON.stringify(result, null, 4);
        res.send(resultJson);
    });
}

export {
    list
};