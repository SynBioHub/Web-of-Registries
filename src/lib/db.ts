/* SynBioHub Federator
 * Web of Registries
 *
 * Database Persistence
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

import * as Sequelize from 'sequelize';
import * as Umzug from 'umzug';

const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    storage: './data/registries.sqlite'
});

export interface SynBioHubAttribute {
    uriPrefix: String,
    instanceUrl: String,
    updateSecret: String, 
}

export interface SynBioHubInstance extends Sequelize.Instance<SynBioHubAttribute>, SynBioHubAttribute { }

export interface SynBioHubModel extends Sequelize.Model<SynBioHubInstance, SynBioHubAttribute> {};

const SynBioHub = sequelize.define<SynBioHubInstance, SynBioHubAttribute>('synbiohub', {
    uriPrefix: {
        type: Sequelize.STRING,
        allowNull: false
    },
    instanceUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    updateSecret: {
        type: Sequelize.STRING
    }
}, {
        validate: {
            validSynBioHub() {
                //TODO
            }
        },
        freezeTableName: true
    })

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize
    },
    migrations: {
        path: 'src/migrations',
        pattern: /^\d+[\w-]+\..s$/,
        params: [
            sequelize.getQueryInterface(), // queryInterface
            sequelize.constructor, // DataTypes
            function () {
                throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }
        ],
    }
});

export {
    sequelize,
    umzug,
    SynBioHub
};