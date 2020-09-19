import * as path from "path";
import { Demopage } from "webpage-templates";

const DEST_DIR = path.resolve(__dirname, "..", "docs");
const PAGE_DATA_PATH = path.resolve(__dirname, "config", "page-data.json");
const minified = true;

Demopage.build(DEST_DIR, PAGE_DATA_PATH, !minified);
