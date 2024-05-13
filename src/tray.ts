import { app, Menu, dialog, NativeImage, Tray, BrowserWindow } from "electron"

export class AppTray {
    tray: Tray | undefined

    constructor(trayIcon: NativeImage, mainWindow: BrowserWindow) {
        this.tray = new Tray(trayIcon)
        const contextMenu = Menu.buildFromTemplate([
            {
                label: "versions", type: "normal", click: () => {
                    dialog.showMessageBox({
                        type: "info",
                        title: "versions",
                        icon: trayIcon,
                        message: `version: ${app.getVersion()}\nnode: ${process.versions.node}\nelectron: ${process.versions.electron}\nv8: ${process.versions.v8}`,
                    })
                }
            },
            { label: "checkbox", type: "checkbox" },
            { label: "radio", type: "radio" },
            { label: "separator", type: "separator" },
            {
                label: "submenu", type: "submenu", submenu: [
                    { label: "normal", type: "normal" },
                    { label: "checkbox", type: "checkbox" },
                    { label: "radio", type: "radio" },
                    { label: "separator", type: "separator" }
                ]
            },
        ])
        this.tray.setToolTip("SoundCloud")
        this.tray.addListener("double-click", () => {
            if (mainWindow) mainWindow.show()
        })
        this.tray.setContextMenu(contextMenu)
    }
}