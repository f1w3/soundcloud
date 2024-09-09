import fs from "fs"

fs.rm(".out", { recursive: true }, (err) => {
    if (err) return console.log("FILE DONT EXIST")
    console.log("REMOVE .out DIRECTORY")
})
fs.rm(".dist", { recursive: true }, (err) => {
    if (err) return console.log("FILE DONT EXIST")
    console.log("REMOVE .dist DIRECTORY")
})