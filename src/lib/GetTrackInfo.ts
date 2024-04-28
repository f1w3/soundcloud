/**
 * Retrieves information about the currently playing track on the page.
 * @returns {Promise<string>} A JSON string containing the title, author, artwork URL, and URL of the currently playing track.
 */
export const getTracks = `new Promise(resolve => {
    const playEl = document.querySelector('.playControls__play');
    const titleEl = document.querySelector('.playbackSoundBadge__titleLink');
    const authorEl = document.querySelector('.playbackSoundBadge__lightLink');
    const artworkEl = document.querySelector(".playbackSoundBadge__avatar .image .sc-artwork");
    if (!playEl || !playEl.classList.contains('playing') || !titleEl || !authorEl || !artworkEl) resolve("undefined");
    const content = { title: titleEl.title, author: authorEl.title, artwork: artworkEl.style.backgroundImage.replace('url("', '').replace('")', ''), url: titleEl.href };
    resolve(JSON.stringify(content));
});
`;
