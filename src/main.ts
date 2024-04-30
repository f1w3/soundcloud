import { app, BrowserWindow, Menu, dialog, shell } from "electron"

const isDevelopment = process.env.NODE_ENV == "development"

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()

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
    const isDarkMode = store.get("darkMode")

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        backgroundColor: isDarkMode ? "#0b0c0c" : "#ffffff",
        "show": false,
        webPreferences: {
            sandbox: true
        }
    })
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: "deny" }
    })
    mainWindow.once('ready-to-show', () => mainWindow?.show())
    mainWindow.webContents.on("did-start-loading", () => { if (mainWindow && store.get("darkMode")) mainWindow.webContents.insertCSS(DarkModeCSS).then(value => insertedList.push(value)) })
    mainWindow.webContents.on("did-finish-load", async () => {
        if (!mainWindow) return
        if (isDevelopment) {
            console.log("development mode enabled")
            mainWindow.webContents.openDevTools()
        }
        if (!mainInterval) {
            mainInterval = setInterval(async () => {
                if (!mainWindow) return
                const trackInfo = await mainWindow.webContents.executeJavaScript(getTracks);
                rpc.setActivity(trackInfo)
            }, 5000)
        }
    })
    mainWindow.on("close", () => { if (mainInterval) clearInterval(mainInterval) })
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
    autoUpdater.on("update-downloaded", (event) => {
        dialog.showMessageBox({
            type: "question",
            buttons: ['今すぐ再起動', 'また後で再起動'],
            title: "自動アップデート君 ^. .^",
            message: `ダウンロード後のバージョン: v${event.version}`,
            detail: 'アップデートの準備が完了しました！再起動しますか？',
        }).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    })
    autoUpdater.on('error', err => console.log(err));
    autoUpdater.on('checking-for-update', () => console.log('checking-for-update'))
    autoUpdater.on('update-available', () => console.log('update-available'))
    autoUpdater.on('update-not-available', () => console.log('update-not-available'))
    autoUpdater.checkForUpdates()
    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 60000 * 15)
})
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit() })