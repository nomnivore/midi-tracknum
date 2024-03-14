import fs from "fs";
import path from "path";
import { parseMidi } from "midi-file";

const dir = "./files";

function getFilenames(dir: string) {
  return fs.readdirSync(dir, { withFileTypes: true });
}

function numTracks(data: Buffer) {
  const midi = parseMidi(data);

  return midi.tracks.length - 1;
}

export function renameFilesInDir(dir: string) {
  const files = getFilenames(dir);
  files.forEach((file) => {
    if (file.isDirectory()) {
      // TODO: consider a depth limit
      return renameFilesInDir(path.join(dir, file.name));
    }

    if (!file.name.endsWith(".mid")) return;

    const data = fs.readFileSync(path.join(dir, file.name));

    // check if file name starts with '# - ' where # is the number of tracks
    const tracks = numTracks(data);
    const prefix = `${tracks} - `;
    if (file.name.startsWith(prefix)) return;

    // rename file
    const newFilename = `${prefix}${file.name}`;
    try {
      fs.renameSync(path.join(dir, file.name), path.join(dir, newFilename));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(`Error renaming file: ${file.name}\n\t${e}`);
    }
  });
}

renameFilesInDir(dir);
