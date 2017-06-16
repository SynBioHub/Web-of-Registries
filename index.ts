/* SynBioHub Federator
 * Web of Registries
 *
 * Application entry point
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import { app } from './src/app';
import { Config } from './src/lib/config';

let config = new Config();

let server = app();

let port = config.get('applicationPort');

server.listen(port);
