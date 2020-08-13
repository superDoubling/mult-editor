/**
* @param { Egg.Application } app egg app
*/
module.exports = app => {
    const { INTEGER, STRING } = app.Sequelize;
    const { model } = app;
    return model.define(
        'file',
        {
            id: {
                type: INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            filename: {
                type: STRING(100),
                allowNull: false,
                comment: '文件名',
            },
            create_at: {
                type: INTEGER(10).UNSIGNED,
                allowNull: false,
                comment: '创建时间',
            },
            update_at: {
                type: INTEGER(10).UNSIGNED,
                allowNull: false,
                comment: '修改时间',
            },
        },
        {
            comment: '文件表',
        }
    );
};
