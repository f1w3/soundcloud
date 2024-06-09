import { app, nativeImage } from "electron";
import icon from "@/images/soundcloud.png"

export const isDev = () => !app.isPackaged

export const trayIcon = nativeImage.createFromDataURL(icon)