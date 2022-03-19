const fs = require('fs');
const request = require('request');
interface BaseInfoInterface {
    name: string;
    url: string;
}
interface ServiceDataInterface extends BaseInfoInterface {
    swaggerVersion?: string;
    location?: string;
}
interface ConstructorInterface {
    host: string;
    directory: string;
    apiModule: string;
    service: string;
}
interface ModuleDataInterface {
    paths: any;
    basePath: string;
    tags: string[];
}
interface HandleInfoInterface {
    tags: string[];
    summary: string;
    operationId: string;
}
interface TagsInterface {
    description: string;
    name: string;
}
interface ApiFileInterface {
    file: TagsInterface;
    name: string;
    data: any[];
}
interface ParseContentInterface {
    fileName: string;
    controllerName: string;
    data: any[];
}
interface FunctionTemplateInterface {
    path: string;
    method: string;
    comment: string;
}
interface CommentDataInterface {
    title: string;
    apiDocPath: string;
}
class SWAGGER {
    // 接口文档域名
    host: string;
    // 错误信息
    error: string;
    // 生成api文件所属目录
    directory: string;
    // 接口所属服务
    service: string;
    //api模块名称
    apiModule: string;
    constructor({ host, directory, apiModule, service }: ConstructorInterface) {
        this.host = host;
        this.directory = directory;
        this.apiModule = apiModule;
        this.service = service;
        this.error = '';
    }
    // 简单封装一下公共请求方法
    myRequest(url: string): Promise<{ T: any }> {
        return new Promise(resolve => {
            request({ url }, (e: any, r: any) => {
                console.log('e', e);
                resolve(JSON.parse(r.body));
            });
        });
    }
    startTask(): void {
        this.getAllService();
    }
    // 获取所有服务
    async getAllService(): Promise<void> {
        const data: any = await this.myRequest(`${this.host}/swagger-resources`);
        if (this.service !== 'all') {
            console.log('data.find', data);

            const findItem = data.find((item: ServiceDataInterface) => item.name === this.service);
            findItem && this.getModuleApi(findItem);
            return;
        }
        data.forEach((item: any) => this.getModuleApi(item));
    }
    //获取当前服务下的模块以及api
    async getModuleApi({ name, url }: BaseInfoInterface): Promise<void> {
        const startTime = new Date().getTime();
        const dirName = `${this.directory}/${name}`;
        //生成文件夹
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
        const data = await this.myRequest(`${this.host}${url}`);
        if (data) {
            this.handleModuleData(<any>data, name);
        }
        const endTime = new Date().getTime();
        console.log(`${name} 转化使用时间`, endTime - startTime, 'ms');
    }
    /**
     * 处理模块api数据
     * @private
     * @param {paths, basePath, tags}
     * @param name
     */
    handleModuleData<T extends ModuleDataInterface>(handleValue: T, name: string): void {
        const { paths = {}, basePath = '', tags = [] } = handleValue;
        const servicePath = basePath && basePath.split('v1')[1];
        const allApiMap = new Map();
        const setApiData = ({ tag, operationId, ...other }: any, path: string, method: string) => {
            const apiDocPath = `${name}/${tag}/${operationId}`;
            const data = { apiDocPath, path: `${servicePath}${path}`, method, ...other };
            let arr: any[] = [];
            if (allApiMap.has(tag)) {
                arr = allApiMap.get(tag);
            }
            arr.push(data);
            allApiMap.set(tag, arr);
        };
        for (const [key, value] of Object.entries(paths)) {
            const { get = null, post = null, put = null, delete: del = null }: any = value;
            if (get) {
                setApiData(this.handleInfo(get), key, 'get');
            }
            if (post) {
                setApiData(this.handleInfo(post), key, 'post');
            }
            if (put) {
                setApiData(this.handleInfo(put), key, 'put');
            }
            if (del) {
                setApiData(this.handleInfo(del), key, 'del');
            }
        }
        const setData = (data: any) => {
            return { name, file: data, data: allApiMap.get(data.name) };
        };
        if (this.apiModule !== 'all' && this.service !== 'all') {
            const findItem: any = tags.find((item: any) => item.name === this.apiModule);
            findItem && this.creatApiFile(setData(findItem));
            return;
        }
        tags.forEach((item: any) => this.creatApiFile(setData(item)));
    }
    /**
     * 处理需要的接口信息
     * @private
     * @param value
     */
    handleInfo(value: HandleInfoInterface): any {
        const { tags, summary, operationId } = value;
        return {
            tag: tags[0],
            title: summary,
            operationId
        };
    }
    creatApiFile({ file, name, data }: ApiFileInterface): void {
        const transName = file.description.toLowerCase().replace(/ /g, '-');
        const fileName = `${this.directory}/${name}/${transName}.ts`;
        this.parseContent({ fileName, controllerName: file.name, data });
    }
    /**
     * 生成api文件以及内容
     * @private
     * @param {fileName, controllerName, data}
     */
    parseContent({ fileName, controllerName, data }: ParseContentInterface): void {
        const file = data
            .map((item: any) => {
                let { path, method } = item;
                method = method.toLowerCase();
                path = path.replace(/\{|\}|\./g, '');
                const comment = this.getComments(item);
                return this.getFunctionTemplate({ path, method, comment });
            })
            .join('');
        const getFileData = this.getTemplateFile(controllerName);
        const fileContent = getFileData.replace('{REQUEST_FUNCTIONS}', file);
        fs.writeFileSync(`${fileName}`, fileContent);
    }
    getTemplateFile(controllerName: string): string {
        return `/**
 * 文档所属菜单：${controllerName}
 */
import { get, put, post, del } from '@/ajax/req';
{REQUEST_FUNCTIONS}
`;
    }

    getFunctionTemplate({ path, method, comment }: FunctionTemplateInterface): string {
        const functioName = this.getFunctionName(path, method);
        const content = `export const ${functioName}:any = (data?: any, config?: any) => ${method}(\'${path}\', data, config);`;
        return `
${comment}
${content}
`;
    }
    /**
     * 生成方法名字
     * @private
     * @param path
     * @param method
     */
    getFunctionName(path: string, method: string): string {
        return (
            method +
            path
                .replace(/\_|-/g, '/')
                .split('/')
                .filter(Boolean)
                .map((item: any) => this.letterToUpper(item, 0))
                .join('')
        );
    }

    /**
     * 生成注释
     * @param item
     * @private
     */
    getComments(item: CommentDataInterface): string {
        const str = `/**
 * ${item.title}
 * 接口地址: ${this.host}/doc.html#/${item.apiDocPath}
 */`;
        return str;
    }
    /**
     * 字母转大写
     * @param value
     * @private
     */
    letterToUpper(value: string, number: number): string {
        if (number > value.length - 1 || value === '') {
            this.setError('索引大于字符串长度了');
            return value;
        }
        return value.replace(value[0], value[0].toUpperCase());
    }
    setError(value: string): void {
        this.error = value;
        throw new Error(value);
    }

    getError(): string {
        return this.error;
    }
}
module.exports = SWAGGER;
