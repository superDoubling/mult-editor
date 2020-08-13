/** @type Egg.EggPlugin */
module.exports = {
    sequelize: {
        enable: true,
        package: 'egg-sequelize',
    },

    redis: {
        enable: true,
        package: 'egg-redis',
    },

    nunjucks: {
        enable: true,
        package: 'egg-view-nunjucks',
    },

    cors: {
        enable: true,
        package: 'egg-cors',
    },
};
