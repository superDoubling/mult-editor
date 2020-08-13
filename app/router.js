
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/page/new', controller.home.newPage);
    router.get('/page/view', controller.home.viewPage);
    router.get('/page/edit', controller.home.editPage);

    router.post('/file/create', controller.file.createFile);
    router.get('/file/list', controller.file.loadFileList);
    router.get('/file/download', controller.file.downloadFile);
    router.get('/file/token', controller.file.getEditToken);
    router.post('/file/releaseToken', controller.file.releaseToken);
    router.get('/file/content', controller.file.getFileContent);
    router.post('/file/edit', controller.file.editFile);
};
