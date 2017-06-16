/* SynBioHub Federator
 * Web of Registries
 *
 * Application entry point
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import { app } from './src/app';

let server = app();

server.listen(9999);
