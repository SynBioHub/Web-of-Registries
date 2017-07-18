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

export interface UserAttribute {
    email: String,
    password: String,
}

export interface SynBioHubAttribute {
    name: String,
    description: String,
    uriPrefix: String,
    instanceUrl: String,
    updateSecret: String,
    approved: Boolean,
    administratorEmail: String,
    updateEndpoint: String,
    updateWorking: Boolean
}

export interface SynBioHubInstance extends Sequelize.Instance<SynBioHubAttribute>, SynBioHubAttribute { };

export interface SynBioHubModel extends Sequelize.Model<SynBioHubInstance, SynBioHubAttribute> { };

export interface UserInstance extends Sequelize.Instance<UserAttribute>, UserAttribute { };

export interface UserModel extends Sequelize.Model<UserInstance, UserAttribute> { };

const SynBioHub = sequelize.define<SynBioHubInstance, SynBioHubAttribute>('synbiohub', {
    uriPrefix: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    instanceUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    updateSecret: {
        type: Sequelize.STRING
    }, 
    approved: {
        type: Sequelize.BOOLEAN
    },
    administratorEmail: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    updateEndpoint: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    updateWorking: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
        validate: {
            validSynBioHub() {
                //TODO
            }
        },
        freezeTableName: true
});

const User = sequelize.define<UserInstance, UserAttribute>('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
        freezeTableName: true
});

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
    SynBioHub,
    User
};