import Sequelize from 'sequelize';
import dotenv from 'dotenv-flow';

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default async () => {
    let maxReconnects = 20;
    let connected = false;

    const sequelize = new Sequelize(process.env.MYSQL_TABLE, process.env.MYSQL_USERNAME , process.env.MYSQL_PASSWORD, {
        dialect: 'mysql',
        operatorsAliases: Sequelize.Op,
        host: process.env.DB_HOST || 'localhost',
    });

    console.log(process.env.MYSQL_TABLE, process.env.MYSQL_USERNAME , process.env.MYSQL_PASSWORD);

    while (!connected && maxReconnects) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await sequelize.authenticate();
            connected = true;
        } catch (err) {
            console.log('reconnecting in 5 seconds');
            // eslint-disable-next-line no-await-in-loop
            await sleep(5000);
            maxReconnects -= 1;
        }
    }

    if (!connected) {
        return null;
    }

    const models = {
        user: sequelize.import('./User'),
        account: sequelize.import('./Account')
    };

    Object.keys(models).forEach((modelName) => {
        if ('associate' in models[modelName]) {
            models[modelName].associate(models);
        }
    });

    models.sequelize = sequelize;
    models.Sequelize = Sequelize;
    models.op = Sequelize.Op;

    return models;
};