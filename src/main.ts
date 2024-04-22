import { app, BrowserWindow, Menu } from "electron"
import { Client as DiscordRPCClient } from "discord-rpc"
import localShortcuts from "electron-localshortcut"
import Store from "electron-store"
import DarkModeCSS from "./theme/dark"

const store = new Store<Partial<Electron.Rectangle>>()
const rpc = new DiscordRPCClient({ transport: "ipc" })
rpc.login({ clientId: "1231582371581657160" }).catch(console.error)

Menu.setApplicationMenu(null)
let mainWindow: BrowserWindow | null
let mainInterval: NodeJS.Timeout | undefined

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
        },
    })
    mainWindow.setBounds(store.get("bounds"))
    mainWindow.webContents.on("did-finish-load", async () => {
        if (store.get("darkMode")) {
            if (mainWindow) await mainWindow.webContents.insertCSS(DarkModeCSS)
        }

        if (!mainInterval) mainInterval = setInterval(async () => {
            if (!mainWindow) return
            const trackInfo = await mainWindow.webContents.executeJavaScript(`
            new Promise(resolve => {
                const playEl = document.querySelector('.playControls__play');
                const titleEl = document.querySelector('.playbackSoundBadge__titleLink');
                const authorEl = document.querySelector('.playbackSoundBadge__lightLink');
                const artworkEl = document.querySelector(".playbackSoundBadge__avatar .image .sc-artwork");
                if (!playEl || !playEl.classList.contains('playing') || !titleEl || !authorEl || !artworkEl) resolve("undefined");
                const content = { title: titleEl.title, author: authorEl.title, artwork: artworkEl.style.backgroundImage.replace('url("', '').replace('")', '') }
                resolve(JSON.stringify(content));
            });
            `);
            if (trackInfo == "undefined") return
            const track: { title: string, author: string, artwork: string } = JSON.parse(trackInfo)
            rpc.setActivity({
                details: track.title,
                state: `by ${track.author}`,
                largeImageKey: track.artwork,
                largeImageText: track.title,
                smallImageKey: "soundcloud",
                smallImageText: "on SoundCloud",
                startTimestamp: undefined,
                buttons: [
                    {
                        label: "Listen music",
                        url: mainWindow.webContents.getURL()
                    }
                ]
            }, process.pid)
        }, 10000)
    })
    mainWindow.on("close", () => { store.set("bounds", mainWindow ? mainWindow.getBounds() : { x: 25, y: 38, width: 800, height: 600 }) })
    mainWindow.on("closed", () => { mainWindow = null })
    localShortcuts.register(mainWindow, "F1", () => {
        store.set("darkMode", !(store.get("darkMode")))
        if (mainWindow) mainWindow.reload()
    })
    mainWindow.loadURL("https://soundcloud.com/discover")
}

app.on("ready", createWindow)
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit() })
app.on("activate", () => { if (mainWindow === null) createWindow() })