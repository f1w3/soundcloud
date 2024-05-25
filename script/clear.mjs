import fs from "fs"

fs.rmdir(".out", { recursive: true }, (err) => {
    if (err) return console.log("FILE DONT EXIST")
    console.log("REMOVE .out DIRECTORY")
})
fs.rmdir(".dist", { recursive: true }, (err) => {
    if (err) return console.log("FILE DONT EXIST")
    console.log("REMOVE .dist DIRECTORY")
})