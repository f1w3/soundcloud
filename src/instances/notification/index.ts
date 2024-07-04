import { Instance } from "../instance"
import { BrowserWindowConstructorOptions } from "electron"
import html from "./index.html"
import main from "./theme/main.css"
import Store from "electron-store"

class NotificationWindow extends Instance {
    private store = new Store()
    constructor(name: string, options?: BrowserWindowConstructorOptions) {
        super(name, {
            ...options,
            show: false,
            width: 400,
            height: 350,
            frame: false,
            transparent: true,
            resizable: false,
            hasShadow: false,
            webPreferences: {
                devTools: false
            },
            alwaysOnTop: true,
            skipTaskbar: true
        });
        if (!this.window) return
        this.window.setIgnoreMouseEvents(true)
        this.window.setAlwaysOnTop(true, "screen-saver")
        this.window.maximize()
        const file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html)
        this.window.on('ready-to-show', () => {
            if (!this.window) return
            this.window.webContents.insertCSS(main)
            this.window.show()
        })
        this.window.loadURL(file)
    }

    showNotification(title: string, picture: string) {
        if (!this.window) return
        this.window.webContents.executeJavaScript(`
            createNotification(
                '${title}',
                '${picture}',
                ${this.store.get("darkMode")},
            );
        `)
    }
}

export const notificationWindow = new NotificationWindow("notification")