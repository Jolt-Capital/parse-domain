import { resolve } from "path";
import fileSystem from "fs";
import { promisify } from "util";
import { fetchBuildSerializeTries } from "../update-tries";
import { PUBLIC_SUFFIX_URL } from "../config";
import { Await } from "../type-util";

// TODO: Replace this with fs promises once we removed Node 8
const fs = {
  writeFile: promisify(fileSystem.writeFile),
};

const writeTriesToFiles = async ({
  serializedIcannTrie,
  serializedPrivateTrie,
}: Await<ReturnType<typeof fetchBuildSerializeTries>>) => {
  const indexOfScriptArg = process.argv.lastIndexOf("--");
  const targetDirectories = process.argv.slice(indexOfScriptArg + 1);

  await Promise.all(
    targetDirectories.map(async (targetDirectory) => {
      const pathToIcannTrie = resolve(__dirname, targetDirectory, "icann.json");
      const pathToPrivateTrie = resolve(
        __dirname,
        targetDirectory,
        "private.json"
      );
      const pathToTrieInfoFile = resolve(
        __dirname,
        targetDirectory,
        "info.json"
      );

      console.warn(`Writing ${pathToIcannTrie}...`);
      console.warn(`Writing ${pathToPrivateTrie}...`);
      console.warn(`Writing ${pathToTrieInfoFile}...`);

      await Promise.all([
        fs.writeFile(pathToIcannTrie, JSON.stringify(serializedIcannTrie)),
        fs.writeFile(pathToPrivateTrie, JSON.stringify(serializedPrivateTrie)),
        fs.writeFile(
          pathToTrieInfoFile,
          JSON.stringify({
            updatedAt: new Date(),
          })
        ),
      ]);
    })
  );
};

export const done = (async () => {
  console.warn(`Fetching public suffix list from ${PUBLIC_SUFFIX_URL}...`);

  await writeTriesToFiles(await fetchBuildSerializeTries());
})();
