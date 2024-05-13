import { Client } from "discord-rpc"
import { Track } from "../types/track"
import { truncateString } from "./truncateString"

/**
 * Provides a Discord Rich Presence integration for displaying the currently playing track information.
 *
 * The `DiscordRPC` class manages the connection to the Discord RPC client and sets the activity
 * information to be displayed, including the track title, artist, artwork, and a link to listen to the track.
 *
 * @param clientId - The client ID to use for logging in to the Discord RPC client.
 */
export class DiscordRPC {
    rpc: Client;
    /**
     * Constructs a new RPC client instance with the provided client ID and options.
     * The client is logged in using the provided client ID.
     *
     * @param clientId - The client ID to use for logging in.
     * @param options - The options to configure the RPC client.
     */
    constructor(clientId: string) {
        this.rpc = new Client({ transport: "ipc" });
        this.rpc.login({ clientId: clientId }).catch(console.error);
    }
    /**
     * Sets the Discord Rich Presence activity with information about the currently playing track.
     *
     * @param trackInfo - A JSON string containing information about the currently playing track.
     * @returns Void
     */
    setActivity(trackInfo: string) {
        if (trackInfo == "undefined") {
            this.rpc.clearActivity();
            return;
        }
        const track: Track = JSON.parse(trackInfo);
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
        });
    }
}
