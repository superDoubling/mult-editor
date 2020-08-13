/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path');
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    config.keys = appInfo.name + '_1597064411417_9598';

    config.middleware = [];

    // 静态资源路径
    config.static = {
        prefix: '/public/',
        dir: path.join(appInfo.baseDir, 'app/public'),
    };

    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.html': 'nunjucks',
        },
    };

    config.security = {
        csrf: {
            enable: false,
        },
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    };

    config.sequelize = {
        dialect: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'mult_editor',
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
        query: {
            charset: 'utf8mb4',
        },
        define: {
            timestamps: false,
            paranoid: false,
            freezeTableName: true,
            underscored: true,
        },
        timezone: '+08:00',
        logging: false,
    };

    config.redis = {
        client: {
            port: 6379,
            host: '127.0.0.1',
            password: '',
            db: 0,
        },
    };

    const userConfig = {
        serverUrl: 'http://127.0.0.1:8080',
    };

    return {
        ...config,
        ...userConfig,
    };
};
