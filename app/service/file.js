const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const os = require('os');
const storePath = path.resolve(os.homedir(), 'file_store');
if (!fs.existsSync(storePath)) {
    fs.mkdirSync(storePath);
}

class FileService extends Service {
    async createFile(filename, content) {
        const { ctx } = this;
        const currentTime = ctx.currentTime;
        const filePath = path.resolve(storePath, filename);
        const fileRecord = await this.getFileByName(filename);
        try {
            if (fs.existsSync(filePath)) {
                throw new Error('文件已存在');
            }
            fs.writeFileSync(filePath, content);
            // 兼容已存在的脏数据
            if (!fileRecord) {
                await ctx.model.File.create({
                    filename,
                    create_at: currentTime,
                    update_at: currentTime,
                });
            }
        } catch (e) {
            if (e.message === '文件已存在') {
                // 有文件没记录补记录
                if (!fileRecord) {
                    await ctx.model.File.create({
                        filename,
                        create_at: currentTime,
                        update_at: currentTime,
                    });
                }
                ctx.throw(400, {
                    code: 400,
                    message: e.message,
                });
            } else {
                fs.unlink(filePath, () => {});
                ctx.logger.info('createFile error cause by %j', e);
                ctx.throw(400, {
                    code: 400,
                    message: '服务器异常，请联系负责人',
                });
            }
        }
    }

    async editFile(fileId, content) {
        const { ctx } = this;
        const currentTime = ctx.currentTime;
        const fileRecord = await this.getFileById(fileId);
        const filePath = path.resolve(storePath, fileRecord.filename);
        try {
            fs.writeFileSync(filePath, content);
            await ctx.model.File.update(
                {
                    update_at: currentTime,
                },
                {
                    where: {
                        id: fileId,
                    },
                }
            );
        } catch (e) {
            ctx.logger.info('editFile error cause by %j', e);
            ctx.throw(400, {
                code: 400,
                message: '服务器异常，请联系负责人',
            });
        }
    }

    async getFileByName(filename) {
        return await this.ctx.model.File.findOne(
            {
                where: {
                    filename,
                },
            }
        );
    }

    async getFileById(fileId) {
        return await this.ctx.model.File.findByPk(fileId, {
            raw: true,
        });
    }

    async loadFileList(filename) {
        const { ctx } = this;
        let sql = 'select *, from_unixtime(create_at, \'%Y-%m-%d %H:%i:%S\') as create_time, from_unixtime(update_at, \'%Y-%m-%d %H:%i:%S\') as update_time from file where 1=1 ';
        if (filename) {
            sql += ` and filename like '%${filename}%' `;
        }
        sql += ' order by id desc';
        return await ctx.model.query(sql, {
            replacement: [ ],
            type: ctx.model.Sequelize.QueryTypes.SELECT,
        });
    }

    async checkToken(fileId, token) {
        const { app } = this;
        const storeToken = await app.redis.get(`file_edit_token_${fileId}`);
        return storeToken === token;
    }

    async getFilePathById(fileId) {
        const file = await this.getFileById(fileId);
        return path.resolve(storePath, file.filename);
    }

    async getFileContentById(fileId) {
        const file = await this.getFileById(fileId);
        file.content = fs.readFileSync(path.resolve(storePath, file.filename)).toString();
        return file;
    }

}

module.exports = FileService;
