import { Instance } from "../instance"
import { BrowserWindowConstructorOptions } from "electron"
import Store from "electron-store"
import html from "./index.html"
import white from "./theme/white.css"
import dark from "./theme/dark.css"

export class HelpWindow extends Instance {
    constructor(name: string, options?: BrowserWindowConstructorOptions) {
        const store = new Store()

        super(name, {
            ...options,
            show: false,
            width: 400,
            height: 350,
            frame: false,
            transparent: true,
        });
        if (!this.window) return
        const file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html)
        this.window.on('ready-to-show', () => {
            if (!this.window) return
            this.window.webContents.insertCSS(store.get("darkMode") ? dark : white)
            this.window.show()
        })
        this.window.on("blur", () => {
            if (!this.window) return
            this.window.close()
        })
        this.window.webContents.on("before-input-event", async (event, input) => {
            if (input.isAutoRepeat || !this.window || input.type == "keyUp") return
            if (input.key == "F2") {
                this.window.close()
                event.preventDefault()
            }
        })
        this.window.loadURL(file)
    }
}
