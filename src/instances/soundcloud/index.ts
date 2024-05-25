import { shell, BrowserWindowConstructorOptions, app } from "electron"
import Store from "electron-store";

import { Instance } from "@/instances/instance";
import DarkModeCSS from "@/theme/dark";
import { getTracks } from "@/lib/getInfo";

import { discord } from "@/discord";
class SoundCloud extends Instance {
    interval: NodeJS.Timeout | undefined
    insertedList: string[] = []
    constructor(name: string, options?: BrowserWindowConstructorOptions) {
        const store = new Store()

        super(name, {
            ...options,
            show: false,
            width: 1070,
            height: 750,
            backgroundColor: store.get("darkMode") ? "#0b0c0c" : "#ffffff",
        });


        if (this.window == undefined) return

        this.window.webContents.setWindowOpenHandler(({ url }) => {
            console.log(url)
            if (url.startsWith("https://soundcloud.com/")) return { action: "allow" }
            if (url == "about:blank") return { action: "allow" }
            shell.openExternal(url);
            return { action: "deny" }
        })

        this.window.once('ready-to-show', () => this.window?.show())

        this.window.webContents.on("did-start-loading", () => {
            if (!this.window) return
            this.window.webContents.insertCSS(`
            ::-webkit-scrollbar {
                width: 9px !important;
                height: 9px !important;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: #757575 !important;
            }
            ::-webkit-scrollbar-thumb {
                background-color: #a8a8a8 !important;
                border-radius: 14px !important;
            }
            ::-webkit-scrollbar-track {
                background-color: #f1f1f1 !important;
            }
            `)
            if (store.get("darkMode")) {
                this.window.webContents.insertCSS(DarkModeCSS).then(value => {
                    this.insertedList.push(value)
                })
            }
        })

        this.window.webContents.on("did-finish-load", async () => {
            if (!this.window) return
            if (!this.interval) {
                this.interval = setInterval(async () => {
                    if (!this.window) return
                    const trackInfo = await this.window.webContents.executeJavaScript(getTracks);
                    if (trackInfo.trim() == "undefined") {
                        discord.clear()
                        return;
                    }
                    discord.set(JSON.parse(trackInfo))
                }, 5000)
            }
        })

        this.window.on("close", () => { if (this.interval) clearInterval(this.interval) })

        this.window.webContents.on("before-input-event", (event, input) => {
            if (input.isAutoRepeat) return
            if (input.key == "F1") {
                if (!this.window) return
                store.set("darkMode", !(store.get("darkMode")))
                if (store.get("darkMode")) {
                    this.window.webContents.insertCSS(DarkModeCSS).then(value => this.insertedList.push(value))
                } else {
                    this.insertedList.forEach(css => this.window?.webContents.removeInsertedCSS(css))
                    this.insertedList = []
                }
                event.preventDefault()
            } else if (input.key == "F5") {
                if (this.window) this.window.reload()
                event.preventDefault()
            } else if (input.key == "F11") {
                if (this.window) this.window.setFullScreen(!this.window.isFullScreen())
                event.preventDefault()
            } else if (input.key == "Escape") {
                if (this.window) this.window.setFullScreen(false)
                event.preventDefault()
            } else if (input.key == "F12") {
                if (this.window) {
                    if (this.window.webContents.isDevToolsOpened()) {
                        this.window.webContents.closeDevTools()
                    } else {
                        this.window.webContents.openDevTools()
                    }
                }
                event.preventDefault()
            }
        })

        app.on("second-instance", () => {
            if (!this.window) return
            if (this.window.isMinimized()) this.window.restore()
            this.window.focus()
        })
        this.window.loadURL("https://soundcloud.com/discover")
    }
}

export const soundcloud = new SoundCloud("soundcloud")