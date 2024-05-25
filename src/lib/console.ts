import path from "path"

const overrideConsoleMethods = [`debug`, `log`, `warn`, `error`, `table`, `dir`] as const

overrideConsoleMethods.forEach((methodName) => {
    const originalLoggingMethod = console[methodName];
    console[methodName] = (...args) => {
        const error = new Error();
        const stack = error.stack?.split('\n');
        const callee = stack && stack[2] ? stack[2].trim() : '';

        const match = callee.match(/\((.*):(\d+):\d+\)$/);
        if (match) {
            const relativeFileName = path
                .relative(process.cwd(), match[1])
                .replace(process.cwd(), '')
                .replace('file:/', '');
            const lineNumber = match[2];
            originalLoggingMethod(...args, `\x1b[90m${relativeFileName}:${lineNumber}\x1b[0m`);
        } else {
            originalLoggingMethod(...args);
        }
    };
});