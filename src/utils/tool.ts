// 判断数据类型
export const typeOf = (obj: any): string => {
    let type: string = Object.prototype.toString.call(obj);
    type = type.replace('[object ', '');
    return type.substring(0, type.length - 1).toLocaleLowerCase();
};
