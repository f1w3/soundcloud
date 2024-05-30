import type { BrowserWindow } from "electron"
import { Track } from "@/types/track"

const execute = `
new Promise(resolve => {
    const playEl = document.querySelector('.playControls__play');
    const titleEl = document.querySelector('.playbackSoundBadge__titleLink');
    const authorEl = document.querySelector('.playbackSoundBadge__lightLink');
    const artworkEl = document.querySelector(".playbackSoundBadge__avatar .image .sc-artwork");
    if (!playEl || !playEl.classList.contains('playing') || !titleEl || !authorEl || !artworkEl) resolve("undefined");
    const title = titleEl.title;
    const author = authorEl.title;
    const artwork = artworkEl.style.backgroundImage.replace('url("', '').replace('")', '');
    const url = ((url) => {
        const parsedUrl = new URL(url);
        parsedUrl.search = '';
        return parsedUrl.toString();
    })(titleEl.href);
    const content = { title: title, author: author, artwork: artwork, url: url };
    resolve(JSON.stringify(content));
});
`

export const getTracks = async (window: BrowserWindow): Promise<Track | undefined> => {
    const result = await window.webContents.executeJavaScript(execute)
    if (result == "undefined") return undefined
    return JSON.parse(result)
}