/* SynBioHub Federator
 * Web of Registries
 *
 * SynBioHub update endpoint
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import * as crypto from 'crypto';
import { SynBioHub } from '../lib/db';
import { Request, Response } from 'express'

function update(req: Request, res: Response) {
    SynBioHub.findById(req.params.instanceId).then(synbiohub => {
        if (synbiohub === null) {
            res.sendStatus(404);
        } else {
            if (req.body.instanceUrl) {
                synbiohub.instanceUrl = req.body.instanceUrl;
            }

            if (req.body.uriPrefix) {
                synbiohub.uriPrefix = req.body.uriPrefix;
            }

            synbiohub.save().then(synbiohub => {
                console.log("Within")
                synbiohub.updateSecret = crypto.randomBytes(48).toString('hex');

                synbiohub.save().then(synbiohub => {
                    let resultJson = JSON.stringify({
                        id: synbiohub.get('id'),
                        uriPrefix: synbiohub.get('uriPrefix'),
                        instanceUrl: synbiohub.get('instanceUrl'),
                        updateSecret: synbiohub.get('updateSecret')
                    }, null, 4);

                    res.send(resultJson);
                });
            }).catch(err => {
                res.status(400);
                res.send(err);
            });
        }
    });
}

export {
    update
};