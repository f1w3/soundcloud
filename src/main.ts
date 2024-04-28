import { app, BrowserWindow, Menu, dialog } from "electron"

const isDevelopment = process.env.NODE_ENV == "development"

Menu.setApplicationMenu(null)
let mainWindow: BrowserWindow | null
let mainInterval: NodeJS.Timeout | undefined
let insertedList: string[] = []

async function initApp() {
    const { DiscordRPC } = await import("./lib/DiscordRPC")
    const Store = (await import("electron-store")).default
    const DarkModeCSS = (await import("./theme/dark")).default
    const { getTracks } = await import("./lib/GetTrackInfo")

    const rpc = new DiscordRPC("1231582371581657160")
    const store = new Store<Record<string, boolean>>()

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720
    })
    mainWindow.webContents.on("did-start-loading", () => {
        if (!mainWindow || !store.get("darkMode")) return
        mainWindow.webContents.insertCSS(DarkModeCSS).then(value => insertedList.push(value))
    })
    mainWindow.webContents.on("did-finish-load", async () => {
        if (!mainWindow) return
        if (isDevelopment) {
            console.log("development mode enabled")
            mainWindow.webContents.openDevTools()
        }
        if (!mainInterval && !isDevelopment) {
            mainInterval = setInterval(async () => {
                if (!mainWindow) return
                const trackInfo = await mainWindow.webContents.executeJavaScript(getTracks);
                rpc.setActivity(trackInfo)
            }, 5000)
        }
    })
    mainWindow.on("close", () => {
        if (mainInterval) clearInterval(mainInterval)
    })
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.isAutoRepeat) return
        if (input.key == "F1") {
            if (!mainWindow) return
            store.set("darkMode", !(store.get("darkMode")))
            if (store.get("darkMode")) {
                mainWindow.webContents.insertCSS(DarkModeCSS).then(value => insertedList.push(value))
            } else {
                insertedList.forEach(css => mainWindow?.webContents.removeInsertedCSS(css))
                insertedList = []
            }
            event.preventDefault()
        } else if (input.key == "F5") {
            if (mainWindow) mainWindow.reload()
            event.preventDefault()
        }
    })
    mainWindow.loadURL("https://soundcloud.com/discover")
}

app.on("ready", async () => {
    initApp()
    const { autoUpdater } = await import("electron-updater")
    autoUpdater.checkForUpdates()
    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 60000 * 15)
    autoUpdater.on("update-downloaded", (event) => {
        dialog.showMessageBox({
            type: 'info',
            buttons: ['今すぐ再起動', 'また後で再起動'],
            title: "自動アップデート君 ^. .^",
            message: `ダウンロード後のバージョン: v${event.version}`,
            detail: 'アップデートの準備が完了しました！再起動しますか？'
        }).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    })
    autoUpdater.on('error', (message) => {
        console.error('There was a problem updating the application')
        console.error(message)
    })
})
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit() })