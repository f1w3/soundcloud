import { app, Menu } from "electron"

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()
Menu.setApplicationMenu(null)

app.on("ready", async () => {
    const { logger } = await import("@log4js")
    const { translate, key } = await import("@i18n")
    logger.debug(translate(key.debug.init.app))
    await import("@/updater.ts")
    await import("@discord")
    await import("@instance/soundcloud")
    //await import("@/tray.ts")
})

app.on("before-quit", async () => {
    const { discord } = await import("@discord")
    discord.clear()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})