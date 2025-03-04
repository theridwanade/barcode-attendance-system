import { fileURLToPath } from "url";
import path from "path";

const libdir = path.dirname(fileURLToPath(import.meta.url));
const __dirname = path.join(libdir, "..", "..")

export default __dirname;