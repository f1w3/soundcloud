import "./lib/console"

import { app, Menu } from "electron" 
import "@/updater"
import { discord } from "@/discord"
//import { loadI18n } from "@/i18n/loader"

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()
Menu.setApplicationMenu(null)

app.on("ready", async () => {
    import("@/instances/soundcloud/index.ts")
    //import("@/tray.ts")
})

app.on("before-quit", () => {
    discord.clear()
    
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})