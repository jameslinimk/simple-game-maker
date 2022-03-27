import fs from "fs";
import { marked } from "marked";
import path from "path";
const start = performance.now();
const code = ["export default {"];
const categories = {};
const parseText = (text) => text.replace(new RegExp('"', "g"), '\\"').replace(new RegExp("\n", "g"), "\\n");
const walkPages = async (directory) => {
    for (const file of fs.readdirSync(directory)) {
        const absolute = path.join(directory, file);
        const lstat = fs.statSync(absolute);
        if (lstat.isDirectory()) {
            walkPages(absolute);
            continue;
        }
        if (!lstat.isFile() || !file.endsWith(".md"))
            continue;
        const fileName = file.slice(0, -3);
        const text = fs.readFileSync(absolute).toString("utf-8");
        const infoLine = text.split("\n")[0].startsWith("INFO: ") && JSON.parse(text.split("\n")[0].slice(6));
        if (infoLine?.category) {
            if (!categories[infoLine.category])
                categories[infoLine.category] = [fileName];
            else
                categories[infoLine.category].push(fileName);
            code.push(`\t"${fileName}": "${parseText(marked.parse(text.split("\n").slice(1).join("\n")))}",`);
            continue;
        }
        code.push(`\t"${fileName}": "${parseText(marked.parse(text))}",`);
    }
};
walkPages("./src/lib/docs");
code.push("}", "");
code.push("export const categories: { [key: string]: string[] } = {");
Object.keys(categories).forEach(key => code.push(`\t"${key}": ["${categories[key].join('", "')}"],`));
code.push("}");
fs.writeFileSync("./src/lib/docs/docs.ts", code.join("\n"));
console.log(`Finished in ${(performance.now() - start).toFixed(2)}ms!`);
