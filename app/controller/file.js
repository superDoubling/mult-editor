const Controller = require('egg').Controller;
const fs = require('fs');

class FileController extends Controller {
    async createFile() {
        const { ctx } = this;
        const { filename, content } = ctx.request.body;
        await ctx.service.file.createFile(filename, content);
        ctx.body = {
            code: 200,
            msg: '创建成功',
        };
    }

    async loadFileList() {
        const { ctx } = this;
        const { filename } = ctx.request.query;
        const fileList = await ctx.service.file.loadFileList(filename);
        ctx.body = {
            code: 200,
            msg: '搜索成功',
            page: {
                totalCount: fileList.length,
                result: fileList,
            },
        };
    }

    async downloadFile() {
        const { ctx } = this;
        const { fileId } = ctx.request.query;
        const filePath = await ctx.service.file.getFilePathById(fileId);
        const fileSize = fs.statSync(filePath).size.toString();
        this.ctx.attachment(filePath);
        this.ctx.set('Content-Length', fileSize);
        this.ctx.set('Content-Type', 'application/octet-stream');
        this.ctx.body = fs.createReadStream(filePath);
    }

    async getEditToken() {
        const { ctx, app } = this;
        const { fileId } = ctx.request.query;
        const key = `file_edit_token_${fileId}`;
        const value = await app.redis.get(key);
        if (value) {
            const time = await app.redis.ttl(key);
            ctx.body = {
                code: 200,
                msg: `有用户正在编辑该文件，请稍候，最长等待时间：${time} 秒`,
            };
        } else {
            const token = ctx.helper.randString(16);
            await app.redis.set(key, token);
            await app.redis.expire(key, 60);
            ctx.body = {
                code: 200,
                msg: 'ok',
                token,
            };
        }
    }

    async releaseToken() {
        const { ctx, app } = this;
        const { fileId, token } = ctx.request.body;
        const key = `file_edit_token_${fileId}`;
        const storeToken = await app.redis.get(key);
        if (storeToken === token) {
            await app.redis.del(key);
        }
    }

    async getFileContent() {
        const { ctx } = this;
        const { fileId } = ctx.request.query;
        const file = await ctx.service.file.getFileContentById(fileId);
        ctx.body = {
            code: 200,
            msg: '查询成功',
            content: file.content,
        };
    }

    async editFile() {
        const { ctx, app } = this;
        const { fileId, token, content } = ctx.request.body;
        const key = `file_edit_token_${fileId}`;
        const storeToken = await app.redis.get(key);
        if (storeToken !== null && token !== storeToken) {
            const time = await app.redis.ttl(key);
            const file = await ctx.service.file.getFileContentById(fileId);
            ctx.body = {
                code: 200,
                lastContent: file.content,
                msg: `有其他用户正在编辑，请确认并于 ${time} 秒后重试`,
            };
            return;
        }
        await ctx.service.file.editFile(fileId, content);
        await app.redis.del(key);
        ctx.body = {
            code: 200,
            msg: '保存成功',
        };
    }

}

module.exports = FileController;
