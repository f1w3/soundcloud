import LicenseChecker from "license-checker-rseidelsohn"
import config from './config.json' with { type: "json" }
import fs from 'fs/promises'

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