import { nativeImage } from "electron"
import path from "path"

export const trayIcon = nativeImage.createFromPath(path.join(__dirname, "../static/soundcloud.png"))