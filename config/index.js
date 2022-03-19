const path = require('path');
const FsEnv = require('./env.js');
const envObj = FsEnv(`../env/.env.${process.env.NODE_ENV}`);

const config = {
    projectName: 'applet-taro-cli',
    date: '2022-3-19',
    designWidth: 750,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
        375: 2 / 1
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-html'],
    defineConstants: {
        ...envObj // 定义环境变量
    },
    copy: {
        patterns: [
            {
                from: 'src/assets/images',
                to: 'dist/assets/images',
                ignore: ['*.js']
            }
        ],
        options: {
            ignore: ['*.ts', '*.js'] // 全局的 ignore
        }
    },
    framework: 'vue3',
    alias: {
        '@': path.resolve(__dirname, '..', 'src')
    },
    sass: {
        // data 的优先级高于 resource
        data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";` // 全局 scss 变量
    },
    csso: {
        enable: true //  CSS 代码压缩
    },
    mini: {
        compile: {
            // 排除不需要经过 Taro 编译的文件
            exclude: [
                modulePath => /[\\/]node_modules[\\/]/.test(modulePath),
                modulePath => /[\\/]scripts[\\/]/.test(modulePath)
                modulePath => /[\\/].cz-config.js[\\/]/.test(modulePath)
            ]
        },
        postcss: {
            autoprefixer: {
                enable: true
            },
            pxtransform: {
                enable: true,
                config: {
                    selectorBlackList: ['nut-'], // 单位装换不转换selectorBlackList中的
                    onePxTransform: false
                }
            },
            url: {
                enable: true,
                config: {
                    limit: 1024 // 设定转换尺寸上限
                }
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    },
    h5: {
        publicPath: '/',
        staticDirectory: 'assets',
        esnextModules: ['nutui-taro'],
        postcss: {
            autoprefixer: {
                enable: true,
                config: {}
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    }
};

module.exports = function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, require('./dev'));
    }
    return merge({}, config, require('./prod'));
};
