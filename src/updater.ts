import { dialog } from "electron"
import { autoUpdater } from "electron-updater"
import { logger } from "./lib/logger"
import { translate as $, key } from "./i18n/loader"

class AppUpdater {
    interval: NodeJS.Timeout | undefined
    value: number = 60000 * 15

    constructor() {
        logger.debug($(key.debug.init.updater))
        autoUpdater.on("update-downloaded", (event) => {
            dialog.showMessageBox({
                type: "question",
                buttons: [$(key.updater.question.restartnow), $(key.updater.question.restartlater)],
                title: $(key.updater.title),
                message: $(key.updater.message, { version: event.version }),
                detail: $(key.updater.detail),
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