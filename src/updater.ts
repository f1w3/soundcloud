import { dialog } from "electron"
import { autoUpdater } from "electron-updater"
import { logger } from "@log4js"
import { translate as $, key } from "@i18n"
import { isDev } from "@env"

class AppUpdater {
    interval: NodeJS.Timeout | undefined
    value: number = 60000 * 15

    constructor() {
        logger.debug($(key.debug.init.updater))
        if (isDev()) {
            logger.warn($(key.updater.devmode))
            return
        }
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
        autoUpdater.on('error', err => logger.error(err));
        autoUpdater.on('checking-for-update', () => logger.info($(key.updater.checking)))
        autoUpdater.on('update-available', (info) => logger.info($(key.updater.available, { version: info.version })))
        autoUpdater.on('update-not-available', (info) => logger.info($(key.updater.not_available, { version: info.version })))
        autoUpdater.on("update-cancelled", (info) => logger.warn($(key.updater.cancelled, { version: info.version })))
        autoUpdater.checkForUpdates()
        this.interval = setInterval(() => {
            autoUpdater.checkForUpdates()
        }, this.value)
    }
}

export const updater = new AppUpdater()