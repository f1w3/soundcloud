import { dialog } from "electron"
import { autoUpdater } from "electron-updater"

class AppUpdater {
    interval: NodeJS.Timeout | undefined
    value: number = 60000 * 15

    constructor() {
        console.log("init updater")
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
        this.interval = setInterval(() => {
            autoUpdater.checkForUpdates()
        }, this.value)
    }
}

export const updater = new AppUpdater()