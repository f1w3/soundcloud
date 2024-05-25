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
            '@locales': path.resolve(__dirname, 'src/i18n/locales/'),
        },
        extensions: [
            '.ts', '.js', '.json'
        ],
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
        ],
    },
    plugins: [
        new WebPackShellPlugin({
            onBuildStart: {
                scripts: ['node script/clear.mjs && node --no-warnings=ExperimentalWarning script/build.mjs'],
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