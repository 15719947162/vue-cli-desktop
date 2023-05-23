const path = require('path');
const glob = require('glob');
const fs = require('fs');
const { patternMap } = require('./build/config.js');
const config = {
    entry: 'main.js',
    html: 'index.html',
    pattern: patternMap.length ? patternMap : ['src/pages/*', 'src/pages/**/*'],
};

const genPages = () => {
    const pages = {};
    const pageEntries = config.pattern.map((e) => {
        const matches = glob.sync(path.resolve(__dirname, e));
        return matches.filter((match) => fs.existsSync(`${match}/${config.entry}`));
    });
    Array.prototype.concat.apply([], pageEntries).forEach((dir) => {
        const filename = dir.split('pages/')[1];
        const pathName = 'src' + dir.split('src')[1];
        pages[filename] = {
            entry: `${pathName}/${config.entry}`,
            template: `${pathName}/${config.html}`,
            filename: `${filename}/${config.html}`,
        };
    });
    return pages;
};

const pages = genPages();

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '../../' : '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    filenameHashing: false,
    productionSourceMap: false,
    pages,
    chainWebpack: (config) => {
        config.resolve.alias.set('@', path.resolve('src'));
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap((options) => {
                options.limit = 100000;
                return options;
            });
        config.optimization.minimizer('terser').tap((args) => {
            // 注释console.*
            args[0].terserOptions.compress.drop_console = true;
            // remove debugger
            args[0].terserOptions.compress.drop_debugger = true;
            // 移除 console.log
            args[0].terserOptions.compress.pure_funcs = ['console.log'];
            // 去掉注释 如果需要看chunk-vendors公共部分插件，可以注释掉就可以看到注释了
            args[0].terserOptions.output = {
                comments: false,
            };
            return args;
        });
    },
    configureWebpack: (config) => {
        config.externals = {
            AMap: 'AMap', // 高德地图配置
        };
    },
    css: {
        extract: true, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false,
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        hack: `true; @import "/src/styles/variables.less";`,
                    },
                },
            },
            sass: {
                prependData: `@import"@/styles/variables.scss";@import"@/styles/base.scss";`,
            },
        },
    },
    devServer: {
        port: 9001,
        open: false,
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: `http://192.168.2.180:7987/`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                },
            },
        },
    },
    pluginOptions: {
        autoprefixer: {
            browsers: ['Android >= 4.0', 'iOS >= 8'],
        },
        'postcss-pxtorem': {
            rootValue: 37.5,
            propList: ['*'],
        },
    },
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico',
        },
    },
};
