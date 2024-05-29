import log4js from "log4js";
import path from "path";

const logDirectory = path.join(process.cwd(), "logs");

const logLayout = {
    type: "pattern",
    pattern: "[%r] [%p] [%z] %m",
};

log4js.configure({
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
});

export const logger = log4js.getLogger();