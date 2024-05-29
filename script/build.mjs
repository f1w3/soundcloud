import fs from 'fs/promises';
import LicenseChecker from "license-checker-rseidelsohn"
import { writeFile } from "./writeFile.mjs"
import config from './config.json' with { type: "json" }
import data from "../src/i18n/locales/default.json" with { type: "json" }

console.log("BUILD REQUIRED FILES")

writeFile(config.theme.dark.output)`
export default \`${config.theme.dark.input}\`
`

writeFile(config.scripts.getInfo.output)`
/**
 * Retrieves information about the currently playing track on the page.
 * @returns {Promise<string>} A JSON string containing the title, author, artwork URL, and URL of the currently playing track.
 */
export const getTracks = \`${config.scripts.getInfo.input}\`
`

console.log("GENERATE LICENSE FILE")

const licenseFiles = [];
const licenses = await new Promise((resolve) => {
    LicenseChecker.init({ start: './', json: true, }, (err, licenses) => resolve(licenses))
})
for (const [key, license] of Object.entries(licenses)) {
    licenseFiles.push({
        name: license.name || key,
        repository: license.repository,
        license: license.licenses,
        licenseText: license.licenseFile && (await fs.readFile(license.licenseFile, 'utf8')),
    })
}
await fs.writeFile(config.license, JSON.stringify(licenseFiles, null, 2));
console.log("CREATED FILE:", config.license)


console.log("GENERATE i18n SCHEME")
function convertSchema(obj) {
    const schema = {}
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            schema[key] = convertSchema(value)
        } else {
            schema[key] = 'string'
        }
    }
    return schema
}

const scheme = convertSchema(data)

fs.writeFile("src/i18n/locales/scheme.json", JSON.stringify(scheme, null, 2), "utf-8")

console.log("CREATED FILE:", "src/i18n/locales/scheme.json")