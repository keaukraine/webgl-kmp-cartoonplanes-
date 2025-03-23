const fs = require("fs");
const path = require("path");

const yargs = require("yargs");
const nsfw = require("nsfw");

/**
 * Usage:
 * node src/watch.js --source=path --destination=path
 * c:\\Work\\KotlinNative\\kmp-engine-frontend\\shared\\build\\dist\\js\\productionLibrary
 */

const argv = yargs.argv;

const watchedPath = argv.source;
const destinationPath = argv.destination ?? ".\\src\\lib";
console.log(`Watching ${watchedPath}`);

let watcher;

return nsfw(
    watchedPath,
    (events) => {
        const files = fs.readdirSync(watchedPath);
        for (const file of files) {
            fs.copyFile(path.join(watchedPath, file), path.join(destinationPath, file),
                (error) => {
                    if (error) {
                        throw error;
                    }
                }
            );
        }
        console.log(`Copied ${files.length} files to the destination folder`);
    })
    .then(function (newWatcher) {
        watcher = newWatcher;
        return watcher.start();
    })
    .then(function () {
        // we are now watching dir1 for events!
        // To stop watching
        // watcher.stop()
    });
