import path from "path";
import WebPackShellPlugin from "webpack-shell-plugin-next";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import type { Configuration } from "webpack";

const config: Configuration = {
    devtool: 'source-map',
    watchOptions: {
        ignored: [
            "**/dark.ts",
            "**/getInfo.ts",
            "**/node_modules",
            "**/scheme.json"
        ]
    },
    ignoreWarnings: [
        {
            module: /log4js/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
    ],
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
        extensions: [
            '.ts', '.js', '.json', '.css'
        ],
        plugins: [
            new TsconfigPathsPlugin({
                logLevel: "INFO"
            })
        ]
    },
    module: {
        rules: [
            {
                // ローダーの処理対象ファイル
                test: /\.ts$/,
                // 利用するローダー
                use: 'babel-loader',
                // ローダーの処理対象から外すディレクトリ
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                type: 'javascript/auto',
                loader: 'json-loader',
            },
            {
                test: /\.css/,
                use: ['to-string-loader', 'css-loader']
            }
        ],
    },
    plugins: [
        new WebPackShellPlugin({
            onBuildStart: {
                scripts: ['node script/clear.mjs && node script/license.mjs && node --no-warnings=ExperimentalWarning script/build.mjs'],
                blocking: true,
                parallel: false
            },
            onDoneWatch: {
                scripts: ['node --no-warnings=ExperimentalWarning script/build.mjs'],
                blocking: true,
                parallel: false
            }
        })
    ],
}

export default config