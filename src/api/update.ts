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
            if (req.body.description) {
                synbiohub.description = req.body.description;
            }

            if (req.body.name) {
                synbiohub.name = req.body.name;
            }

            if (req.body.administratorEmail) {
                synbiohub.administratorEmail = req.body.administratorEmail;
            }

            synbiohub.save().then(synbiohub => {
                synbiohub.updateSecret = crypto.randomBytes(48).toString('hex');

                synbiohub.save().then(synbiohub => {
                    let resultJson = JSON.stringify({
                        name: synbiohub.get('name'),
                        description: synbiohub.get('description'),
                        id: synbiohub.get('id'),
                        uriPrefix: synbiohub.get('uriPrefix'),
                        instanceUrl: synbiohub.get('instanceUrl'),
                        updateSecret: synbiohub.get('updateSecret'),
                        administratorEmail: synbiohub.get('administratorEmail'),
                        updateEndpoint: synbiohub.get('updateEndpoint')
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