import fs from "fs";
const arg = process.argv[2];
console.log(arg);
const mode = arg === "true" || arg === "false" ? arg : "true";
const code = `export const dev = ${mode}
export const basePath = "/simple-game-maker"
export const fullBasePath = "https://jameslinimk.github.io/simple-game-maker/"
`;
fs.writeFileSync("./src/lib/conf.js", code);
console.log("Done!");
