import { app, nativeImage } from "electron";
import path from "path"

export const isDev = () => !app.isPackaged

export const trayIcon = nativeImage.createFromPath(path.join(__dirname, "../static/soundcloud.png"))