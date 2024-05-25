import fs from "fs"

const appendText = "/*\nAUTOMATICALLY GENERATED FILE\n*/\n"

export function writeFile(outpath) {
    return (function (strings, ...filepaths) {
        const writeData = strings.reduce(function (result, string, i) {
            /*
            let readData = ""
            if (filepaths[i]) {
                readData = fs.readFileSync(filepaths[i], "utf-8") || ""
            }
            return result + string + readData
            */
            return result + string + (filepaths[i] ? fs.readFileSync(filepaths[i], "utf-8") || "" : "")
        }, "")
        fs.writeFileSync(outpath, appendText + writeData, "utf-8")
        console.log("CREATED FILE:", outpath)
    })
}