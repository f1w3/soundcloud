import fs from 'fs/promises';
import data from "../src/i18n/locales/default.json" with { type: "json" }

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