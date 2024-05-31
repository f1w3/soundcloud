import path from "path";

const logDirectory = path.join(process.cwd(), "logs")

const consoleLayout = {
    type: "pattern",
    pattern: "[\x1b[90m%r\x1b[0m] %[[%p] [%z] %m%]",
}

const writeLayout = {
    type: "pattern",
    pattern: "[%r] [%p] [%z] %m",
}

export const config = {
    appenders: {
        console: {
            type: "console",
            layout: consoleLayout,
        },
        app: {
            type: "dateFile",
            layout: writeLayout,
            filename: path.join(logDirectory, "latest.log"),
            pattern: "-yyyy-MM-dd",
            compress: true,
        },
    },
    categories: {
        default: {
            appenders: ["console", "app"],
            level: "all"
        }
    }
}