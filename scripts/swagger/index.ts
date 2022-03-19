/**
 *npm run swagger 默认全部生成
 *npm run swagger 所属服务 模块名称（文档左侧菜单名称）   可单独按模块服务生成或者按模块生成，注意：按模块生成不可以缺失服务名称
 *例如: npm run swagger m3z-digital-org （单独生成组织服务）
 *      npm run swagger m3z-digital-org 分组管理（单独生成组织服务下的分组管理）
 *vcotravel-resource 司机接口
 */
const API = require('./api.ts');
const yargs = require('yargs');
const argv = yargs.argv._;
// 接口文档地址
const host = 'http://10.50.125.177:8890';
// 接口所属服务
const service = argv[0] || 'all';
//api模块名称
const apiModule = argv[1] || 'all';
// 生成api文件所属目录
const _directory = 'src/api';
// 初始化配置
const config = {
    host,
    directory: _directory,
    apiModule,
    service
};
const SWAGGER_INSTANCE = new API(config);
SWAGGER_INSTANCE.startTask();
