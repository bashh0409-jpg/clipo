import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const sourceFile = process.argv[2];

if (!sourceFile) {
  console.error("Usage: node scripts/download-logos.mjs <path-to-source-file>");
  process.exit(1);
}

const outputDir = path.resolve("public/logos");
const absoluteSource = path.resolve(sourceFile);

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const source = await readFile(absoluteSource, "utf8");
  const entries = source.match(/\{[\s\S]*?\}/g) ?? [];

  const logos = entries.flatMap((entry) => {
    const company = entry.match(/company:\s*"([^"]+)"/)?.[1];
    const imgSrc = entry.match(/imgSrc:\s*"([^"]+)"/)?.[1];

    if (!company || !imgSrc || !/^https:\/\//i.test(imgSrc)) {
      return [];
    }

    const url = new URL(imgSrc);

    // Restrict downloads to the expected CDN rather than arbitrary URLs.
    if (url.hostname !== "cdn.sanity.io") {
      console.warn(`Skipping untrusted host: ${url.hostname}`);
      return [];
    }

    return [{ company, url: imgSrc }];
  });

  if (logos.length === 0) {
    console.log("No remote Sanity CDN logos found.");
    return;
  }

  await mkdir(outputDir, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const logo of logos) {
    const filename = `${slugify(logo.company)}.svg`;
    const destination = path.join(outputDir, filename);

    try {
      const response = await fetch(logo.url, {
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (
        !contentType.includes("image/svg+xml") &&
        !contentType.includes("application/xml") &&
        !contentType.includes("text/xml") &&
        !contentType.includes("text/plain")
      ) {
        throw new Error(`Unexpected content type: ${contentType}`);
      }

      const svg = await response.text();

      if (!/<svg[\s>]/i.test(svg)) {
        throw new Error("Response does not contain an SVG document");
      }

      // Keep existing assets intact when rerunning the script.
      try {
        await readFile(destination);
        console.log(`Skipped: ${filename} (already exists)`);
        skipped++;
        continue;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }

      await writeFile(destination, svg, "utf8");
      console.log(`Downloaded: ${filename}`);
      downloaded++;
    } catch (error) {
      console.error(`Failed: ${logo.company} — ${error.message}`);
      failed++;
    }
  }

  console.log(
    `\nFinished: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed.`,
  );

  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
