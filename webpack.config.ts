import path from "path";
import WebPackShellPlugin from "webpack-shell-plugin-next";
import type { Configuration } from "webpack";

const config: Configuration = {
    devtool: 'source-map',
    watchOptions: {
        ignored: [
            "**/dark.ts",
            "**/getInfo.ts",
            "**/node_modules"
        ]
    },
    target: "electron-main",
    entry: "./src/main.ts",
    stats: 'minimal',
    node: {
        __dirname: false,
    },
    output: {
        path: path.resolve(__dirname, '.dist'),
        filename: "main.js",
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@instances': path.resolve(__dirname, 'src/instances'),
            '@locales': path.resolve(__dirname, 'src/i18n/locales/'),
        },
        extensions: [
            '.ts', '.js', '.json'
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.json'),
                    },
                }
            },
            {
                test: /\.json$/,
                type: 'javascript/auto',
                loader: 'json-loader',
            },
        ],
    },
    plugins: [
        new WebPackShellPlugin({
            onBuildStart: {
                scripts: ['node script/build'],
                blocking: true,
                parallel: false
            },
            onDoneWatch: {
                scripts: ['node script/build'],
                blocking: true,
                parallel: false
            }
        })
    ],
}

export default config