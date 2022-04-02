import fs from "fs";
import { marked } from "marked";
import path from "path";
const code = ["export default {"];
const categories = {};
const walkPages = (directory, category) => {
    fs.readdirSync(directory).forEach((file) => {
        const absolute = path.join(directory, file);
        const lstat = fs.statSync(absolute);
        if (lstat.isDirectory())
            return walkPages(absolute, file);
        if (!lstat.isFile() || !file.endsWith(".md"))
            return;
        const fileName = file.slice(0, -3);
        const text = fs.readFileSync(absolute).toString("utf-8");
        if (category) {
            if (!categories[category])
                categories[category] = [fileName];
            else
                categories[category].push(fileName);
        }
        code.push(`\t"${fileName}": ${JSON.stringify(marked.parse(text))},`);
    });
};
walkPages("./src/lib/docs/pages");
code.push("}", "");
code.push("export const categories: { [key: string]: string[] } = {");
Object.keys(categories).forEach((key) => code.push(`\t"${key}": ["${categories[key].join('", "')}"],`));
code.push("}", "");
fs.writeFileSync("./src/lib/docs/docs.ts", code.join("\n"));
console.log(categories);
console.log(`Finished in ${performance.now().toFixed(2)}ms!`);
