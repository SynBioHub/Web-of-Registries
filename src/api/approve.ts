/* SynBioHub Federator
 * Web of Registries
 *
 * SynBioHub approve endpoint
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import { Request, Response } from 'express';
import { SynBioHub, SynBioHubInstance } from '../lib/db';
import * as requests from 'request';

function approve(req: Request, res: Response) {
    SynBioHub.findById(req.params.instanceId).then(synbiohub => {
        if (synbiohub === null) {
            res.sendStatus(404);
        } else {
            synbiohub.approved = true;

            synbiohub.save().then(synbiohub => {
                broadcast();

                let resultJson = JSON.stringify({
                    id: synbiohub.get('id'),
                    uriPrefix: synbiohub.get('uriPrefix'),
                    instanceUrl: synbiohub.get('instanceUrl'),
                    updateSecret: synbiohub.get('updateSecret'),
                    administratorEmail: synbiohub.get('administratorEmail'),
                    updateEndpoint: synbiohub.get('updateEndpoint')
                }, null, 4);

                res.redirect('/');
            }).catch(err => {
                res.status(400);
                res.send(err);
            });
        }
    });
}

function broadcast(extra?: SynBioHubInstance) {
    SynBioHub.findAll({
        where: {
            approved: true
        }
    }).then(synbiohubs => {
        let data = synbiohubs.map(synbiohub => {
            return {
                uriPrefix: synbiohub.uriPrefix,
                instanceUrl: synbiohub.instanceUrl
            }
        })

        if(extra !== undefined) {
            synbiohubs = synbiohubs.concat(extra);
        }

        synbiohubs.forEach(synbiohub => {
            let updateUrl = [synbiohub.instanceUrl, synbiohub.updateEndpoint].join('/');

            requests.post(updateUrl, { json: data }, (err, res, body) => {
                if (err) {
                    console.log(err)

                    synbiohub.updateWorking = false;
                } else {
                    synbiohub.updateWorking = true;
                }

                synbiohub.save();
            })
        })
    })
}

export {
    approve,
    broadcast
};