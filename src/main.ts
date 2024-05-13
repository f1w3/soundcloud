import { app, Menu, /*nativeImage*/ } from "electron"
//import type { BrowserWindow } from "electron"
//import path from "path"
import { SoundCloud } from "@/instances/soundcloud/index"
//import { AppTray } from "@/tray"
import { AppUpdater } from "@/updater"
//import { loadI18n } from "@/i18n/loader"

//const trayIcon = nativeImage.createFromPath(path.join(__dirname, "../static/soundcloud.png"))
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()
Menu.setApplicationMenu(null)

app.on("ready", async () => {
    //const i18n = await loadI18n(app.getLocale());
    /*const soundcloud = */new SoundCloud("soundcloud")
    ///*const tray = */new AppTray(trayIcon, soundcloud.window as BrowserWindow)
    /*const updater = */new AppUpdater()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})