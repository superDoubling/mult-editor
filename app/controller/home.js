const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const { ctx } = this;
        await ctx.render('index.html', { serverUrl: ctx.app.config.serverUrl });
    }

    async newPage() {
        const { ctx } = this;
        await ctx.render('newPage.html', { serverUrl: ctx.app.config.serverUrl });
    }

    async viewPage() {
        const { ctx } = this;
        await ctx.render('viewPage.html', { serverUrl: ctx.app.config.serverUrl });
    }

    async editPage() {
        const { ctx } = this;
        const { fileId, token } = ctx.request.query;
        const checkFlag = await ctx.service.file.checkToken(fileId, token);
        // 旧连接重新打开
        if (!checkFlag) {
            ctx.body = '编辑页面已过期，请从列表页重新选择';
            return;
        }
        const file = await ctx.service.file.getFileContentById(fileId);
        await ctx.render('editPage.html', { serverUrl: ctx.app.config.serverUrl, token, file });
    }
}

module.exports = HomeController;
