import { copyFile, mkdir } from "node:fs/promises";

const index = new URL("./dist/index.html", import.meta.url);
const routes = ["orders", "inventory", "procurement", "finance"];

await copyFile(index, new URL("./dist/404.html", import.meta.url));

for (const route of routes) {
    const directory = new URL(`./dist/${route}/`, import.meta.url);
    await mkdir(directory, { recursive: true });
    await copyFile(index, new URL(`./dist/${route}/index.html`, import.meta.url));
}
