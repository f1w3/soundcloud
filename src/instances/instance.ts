import { BrowserWindow, BrowserWindowConstructorOptions } from "electron"

export class Instance {
    window: BrowserWindow | undefined = undefined
    name: string;
    constructor(name: string, options?: BrowserWindowConstructorOptions) {
        this.name = name
        this.window = new BrowserWindow({
            ...options
        })
    }
}
