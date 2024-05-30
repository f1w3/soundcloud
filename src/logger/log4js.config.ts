import path from "path";

const logDirectory = path.join(process.cwd(), "logs")

const logLayout = {
    type: "pattern",
    pattern: "[%r] [%p] [%z] %m",
}

export const config = {
    appenders: {
        console: {
            type: "console",
            layout: logLayout,
        },
        app: {
            type: "dateFile",
            layout: logLayout,
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