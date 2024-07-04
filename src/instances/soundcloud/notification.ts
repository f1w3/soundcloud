import type { BrowserWindow } from "electron"
import Store from "electron-store"
import crypto from "crypto"

const store = new Store()

const execute_popin_notification = (message: string, id: string, isDarkmode: boolean) => `
    if (!document.querySelector('.custom-notification-container')) {
        var notificationContainerr = document.createElement('div')
        notificationContainerr.className = 'custom-notification-container';
        document.body.appendChild(notificationContainerr);
    }
    var notificationContainer = document.querySelector('.custom-notification-container')
    var notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = "${message}";
    notification.style.backgroundColor = ${isDarkmode} ? '#e7e7e7' : '#202020';
    notification.style.color = ${isDarkmode} ? '#202020' : '#e7e7e7';
    notification.style.borderColor = ${isDarkmode} ? '#fff' : '#000';
    notification.id = "${id}";
    notificationContainer.appendChild(notification);
`

const execute_popout_notification = (id: string) => `
    document.getElementById("${id}").remove()
`

export const showNotification = (window: BrowserWindow, message: string): void => {
    const id = crypto.randomBytes(20).toString('hex')
    window.webContents.executeJavaScript(execute_popin_notification(message, id, store.get("darkMode") as boolean)).catch((error) => {
        console.log(error)
    })
    setTimeout(() => {
        window.webContents.executeJavaScript(execute_popout_notification(id)).catch((error) => {
            console.log(error)
        })
    }, 3500)
}