import { Client } from "discord-rpc"
import { Track } from "@/types/track"
import { truncateString } from "./truncate"
import { logger } from "@log4js"
import { translate as $, key } from "@i18n"

class Discord {
    private readonly id: string = "1231582371581657160"
    private rpc: Client
    constructor() {
        logger.debug($(key.debug.init.discord))
        this.rpc = new Client({ transport: "ipc" })
        this.rpc.login({ clientId: this.id }).catch(console.error)
    }

    clear() {
        this.rpc.clearActivity()
    }

    set(track: Track) {
        this.rpc.setActivity({
            details: truncateString(track.title, 128),
            state: `by ${track.author}`,
            largeImageKey: track.artwork,
            largeImageText: truncateString(track.title, 128),
            smallImageKey: "soundcloud",
            smallImageText: "on SoundCloud",
            startTimestamp: undefined,
            endTimestamp: undefined,
            buttons: [
                {
                    label: "Listen music",
                    url: track.url,
                },
            ],
        })
    }
}

export const discord = new Discord()