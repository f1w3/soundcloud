import { app, BrowserWindow, Menu, ipcMain } from "electron"
const { autoUpdater } = require('electron-updater')

Menu.setApplicationMenu(null)
let mainWindow: BrowserWindow | null
let mainInterval: NodeJS.Timeout | undefined

async function initApp() {
    const { DiscordRPC } = await import("./lib/DiscordRPC")
    const Store = (await import("electron-store")).default
    const localShortcuts = (await import("electron-localshortcut")).default
    const DarkModeCSS = (await import("./theme/dark")).default
    const { getTracks } = await import("./lib/GetTrackInfo")

    const rpc = new DiscordRPC("1231582371581657160")
    const store = new Store<Record<string, boolean>>()

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
        },
    })
    mainWindow.webContents.on("did-finish-load", async () => {
        if (store.get("darkMode")) {
            if (mainWindow) await mainWindow.webContents.insertCSS(DarkModeCSS)
        }
        if (!mainInterval) mainInterval = setInterval(async () => {
            if (!mainWindow) return
            const trackInfo = await mainWindow.webContents.executeJavaScript(getTracks);
            rpc.setActivity(trackInfo)
        }, 10000)
    })
    mainWindow.on("close", () => {
        if (mainInterval) {
            clearInterval(mainInterval)
            mainInterval = undefined
        }
    })
    localShortcuts.register(mainWindow, "F1", () => {
        store.set("darkMode", !(store.get("darkMode")))
        if (mainWindow) mainWindow.reload()
    })
    mainWindow.loadURL("https://soundcloud.com/discover")
    mainWindow.webContents.openDevTools()
}
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});
app.on("ready", () => {
    initApp()
    autoUpdater.checkForUpdatesAndNotify()
})
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit() })