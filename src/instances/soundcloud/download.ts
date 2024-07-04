import { soundcloud } from "."
import { SoundCloud } from "scdl-core"
import { dialog } from "electron"
import { showNotification } from "./notification"
import { Stream } from "stream"
import NodeID3 from "node-id3"
import Axios from "axios"
import fs from "fs"
import { Track } from "@/types/track"

export const download = async (_track: Track) => {
    await SoundCloud.connect();
    if (soundcloud.window == undefined) return
    const track = await SoundCloud.tracks.getTrack(_track.url)

    const result = await dialog.showSaveDialog(soundcloud.window, {
        title: "SoundCloud Downloader",
        filters: [{
            extensions: ['mp3'],
            name: 'Music',
        }],
        defaultPath: `${track.title}.mp3`,
    })

    if (result.canceled) return showNotification(soundcloud.window, "保存をキャンセルしました")
    showNotification(soundcloud.window, `保存しています`)
    const stream: Stream = await SoundCloud.download(_track.url)
    if (!stream) return showNotification(soundcloud.window, "楽曲データを取得できませんでした")
    stream
        .pipe(fs.createWriteStream(result.filePath))
        .on("finish", async () => {
            const thumbnailData = await fetchImage(_track.artwork.replace("50x50.jpg", "500x500.jpg") as string)
            const tags: NodeID3.Tags = {
                title: track.title,
                subtitle: track.description,
                artist: track.user.username,
                artistUrl: [track.user.permalink_url],
                originalArtist: track.user.username,
                date: track.created_at.toString(),
                image: {
                    mime: 'image/jpeg',
                    type: {
                        id: 3,
                        name: 'front cover'
                    },
                    description: track.title,
                    imageBuffer: thumbnailData
                }
            };

            NodeID3.write(tags, result.filePath, (err) => {
                if (err) {
                    if (!soundcloud.window) return
                    showNotification(soundcloud.window, `エラーが発生しました`)
                    showNotification(soundcloud.window, `Error writing ID3 tags: ${err}`)
                } else {
                    if (!soundcloud.window) return
                    showNotification(soundcloud.window, `${track.title}を保存しました!`)
                }
            });
        })
        .on("error", (error) => {
            if (!soundcloud.window) return
            showNotification(soundcloud.window, `エラーが発生しました`)
            showNotification(soundcloud.window, error.message)
        })
}

async function fetchImage(url: string) {
    const response = await Axios.get(url, {
        responseType: 'arraybuffer'
    });
    return Buffer.from(response.data, 'binary');
}
