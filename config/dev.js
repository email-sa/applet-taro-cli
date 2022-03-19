module.exports = {
    env: {
        NODE_ENV: '"development"'
    },
    defineConstants: {},
    weapp: {
        module: {
            postcss: {
                cssModules: {
                    enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                    config: {
                        namingPattern: "global/module", // 转换模式，取值为 global/module
                        generateScopedName: "[name]__[local]___[hash:base64:5]"
                    }
                },
                url: {
                    enable: true,
                    config: {
                        limit: 10240 // 文件大小限制
                    }
                }
            }
        }
    },
    mini: {},
    h5: {}
};
