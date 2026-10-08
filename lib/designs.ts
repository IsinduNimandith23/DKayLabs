import fs from "node:fs";
import path from "node:path";
import { DESIGN_CATEGORIES, type Design } from "./constants";

const ROOT = path.join(process.cwd(), "public", "portfolio", "digital-design");
const IMAGE = /\.(jpe?g|png|webp)$/i;

// Brand names the filename can't capitalize on its own.
const WORDS: Record<string, string> = {
  dkaylabs: "DKayLABS",
  lh44: "LH44",
  mj: "MJ",
  htc: "HTC",
  anc: "ANC",
  "2uul": "2UUL",
  websignature: "WebSignature",
  kinzone: "KinZone",
  nodetech: "NodeTech",
  cozypods: "CozyPods",
  qr: "QR",
};

function titleFromFile(file: string): string {
  return file
    .replace(IMAGE, "")
    .split("-")
    .map((w) => WORDS[w] ?? (/^\d+$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/**
 * Every piece of artwork in the Digital Design category folders, read at
 * build time - dropping a file into a folder is all it takes to publish it.
 * Run scripts/optimize-designs.py first so it ships web-sized.
 */
export function getDesigns(): Design[] {
  return DESIGN_CATEGORIES.flatMap(({ title, folder }) => {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE.test(f))
      .sort()
      .map((f) => ({
        src: `/portfolio/digital-design/${folder}/${f}`,
        title: titleFromFile(f),
        category: title,
      }));
  });
}
