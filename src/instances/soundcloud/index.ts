import { shell, BrowserWindowConstructorOptions, app, session } from "electron"
import Store from "electron-store"
import { Instance } from "@/instances/instance"
import darkmode from "./theme/dark.css"
import scrollbar from "./theme/scrollbar.css"
import notification from "./theme/notification.css"
import { getTracks } from "./getinfo.ts"
import { showNotification } from "./notification.ts"
import { discord } from "@/discord"
import { logger } from "@log4js"
import { translate as $, key } from "@i18n"
import { download } from "./download.ts"
import { HelpWindow } from "@instance/help"
//import { notificationWindow } from "../notification/index.ts"
import { Track } from "@/types/track.ts"

class SoundCloud extends Instance {
    interval_Discord: NodeJS.Timeout | undefined
    interval_SoundCloud: NodeJS.Timeout | undefined
    insertedList: string[] = []
    client_id: string | undefined
    playing: boolean = false
    played: Track = { title: "", author: "", url: "", artwork: "" }

    constructor(name: string, options?: BrowserWindowConstructorOptions) {
        logger.debug($(key.debug.init.soundcloud))
        const store = new Store()

        super(name, {
            ...options,
            show: false,
            width: 1070,
            minWidth: 1000,
            height: 750,
            minHeight: 470,
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
            this.window.webContents.insertCSS(scrollbar)
            this.window.webContents.insertCSS(notification)
            if (store.get("darkMode")) {
                this.window.webContents.insertCSS(darkmode).then(value => {
                    this.insertedList.push(value)
                })
            }
        })

        this.window.webContents.on("did-finish-load", async () => {
            if (this.window) {
                showNotification(this.window, "操作方法を確認するにはF2を押してください!")
            }
            if (!this.interval_Discord) {
                this.interval_Discord = setInterval(async () => {
                    if (!this.window || !this.playing) return discord.clear()
                    const trackInfo = await getTracks(this.window);
                    if (!trackInfo) return discord.clear()
                    discord.set(trackInfo)
                }, 5000)
            }
            if (!this.interval_SoundCloud) {
                this.interval_SoundCloud = setInterval(async () => {
                    if (!this.window || !this.playing) {
                        this.played = { title: "", author: "", url: "", artwork: "" }
                        return
                    }
                    const trackInfo = await getTracks(this.window);
                    if (trackInfo && trackInfo.url !== this.played.url) {
                        //notificationWindow.showNotification(trackInfo.title, trackInfo.artwork)
                        this.played = trackInfo
                    }
                }, 1000)
            }
        })

        this.window.on("close", () => {
            if (this.interval_Discord) clearInterval(this.interval_Discord)
            if (this.interval_SoundCloud) clearInterval(this.interval_SoundCloud)
            app.quit()
        })

        this.window.webContents.on("before-input-event", async (event, input) => {
            if (input.isAutoRepeat || !this.window || input.type == "keyUp") return
            if (input.key == "F1") {
                store.set("darkMode", !(store.get("darkMode")))
                if (store.get("darkMode")) {
                    this.window.webContents.insertCSS(darkmode).then(value => this.insertedList.push(value))
                } else {
                    this.insertedList.forEach(css => this.window?.webContents.removeInsertedCSS(css))
                    this.insertedList = []
                }
                event.preventDefault()
            } else if (input.key == "F5") {
                this.window.reload()
                event.preventDefault()
            } else if (input.key == "F11") {
                this.window.setFullScreen(!this.window.isFullScreen())
                event.preventDefault()
            } else if (input.key == "Escape") {
                this.window.setFullScreen(false)
                event.preventDefault()
            } else if (input.key == "F12") {
                if (this.window.webContents.isDevToolsOpened()) {
                    this.window.webContents.closeDevTools()
                } else {
                    this.window.webContents.openDevTools({ mode: "undocked" })
                }
                event.preventDefault()
            } else if (input.key == "F10") {
                event.preventDefault()
                const track = await getTracks(this.window)
                if (!track) {
                    showNotification(this.window, "情報を取得できませんでした")
                    return
                }
                download(track)

            } else if (input.key == "F2") {
                new HelpWindow("helpwindow")
                event.preventDefault()
            }
        })

        app.on("second-instance", () => {
            if (!this.window) return
            if (this.window.isMinimized()) this.window.restore()
            this.window.focus()
        })

        this.window.webContents.on("audio-state-changed", (event) => { this.playing = event.audible })

        session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
            const url = new URL(details.url);
            if (url.hostname == "api-v2.soundcloud.com" && url.searchParams.has("client_id")) {
                this.client_id = url.searchParams.get("client_id") as string
            }
            callback({})
        })

        this.window.loadURL("https://soundcloud.com/discover")
    }
}

export const soundcloud = new SoundCloud("soundcloud")