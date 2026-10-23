/**
 * Copies Next.js static export (`out/`) into repo-root `public/`
 * for Cloudflare Workers Assets (`wrangler.toml` → assets.directory).
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(__dirname, "..");
const repoRoot = join(frontendRoot, "..");
const outDir = join(frontendRoot, "out");
const publicDir = join(repoRoot, "public");

if (!existsSync(outDir)) {
  console.error(
    "Missing frontend/out. Run `npm run build:static` first (STATIC_EXPORT=1).",
  );
  process.exit(1);
}

rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });
cpSync(outDir, publicDir, { recursive: true });
console.log(`Synced ${outDir} → ${publicDir}`);
