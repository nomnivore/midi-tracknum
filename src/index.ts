import fs from "fs";
import inquirer from "inquirer";
import { renameFilesInDir } from "./renamer.js";

const answers = await inquirer.prompt<{ path: string; confirm: boolean }>([
  {
    name: "path",
    message: "Enter the path to the directory your MIDI files are in:\n> ",
    type: "input",
    validate: (input: string) => {
      if (input === "") return "Please enter a path";

      if (!fs.existsSync(input)) return "Path does not exist";

      return true;
    },
  },
  {
    name: "confirm",
    message:
      "Are you sure you want to rename the MIDI files in this directory?",
    type: "confirm",
    default: false,
  },
]);

renameFilesInDir(answers.path);

// wait for any key to exit
process.stdout.write("\nPress any key to exit...");
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", process.exit.bind(process, 0));
