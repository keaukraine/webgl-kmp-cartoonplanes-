const fs = require("fs");
const path = require("path");
const { spawnSync, spawn, exec } = require("child_process");

const yargs = require("yargs");
const nsfw = require("nsfw");

const argv = yargs.argv;

const project = argv.project;
const startServer = !!argv.serve;

if (project === undefined) {
    console.log(`Watches OBJ and Kotlin file changes. Automatically triggers Kotlin code rebuilds and updates compiled JS libraries.
Usage:
  node scripts/watch-frontend.js --path=path/to/KMP/root --project=example --serve=[true|false]
    --path - path to the root of Kotlin frontend project. Can be omitted, then it will be assumed to be in the same directory as web project.
    --project - project name ("example", "brutalism", etc) which corresponds to data and code directories in KMP.
    --serve - whether to start HTTP server in background automatically or not (it will run silently and won't show errors).
`);
    process.exit(1);
}

const pathFrontendBase = argv.path ?? path.join("..", "..", "kmp-engine-frontend");
const pathFrontendSharedArtifacts = path.join(pathFrontendBase, "shared", "build", "dist", "js", "productionLibrary");
const pathProjectData = path.join(pathFrontendBase, "shared", "data", project);
const pathProjectSources = path.join(pathFrontendBase, "shared", "src", "commonMain", "kotlin", "org", "androidworks", project);
const pathEngineSources = path.join(pathFrontendBase, "engine", "src");
const pathBackendLib = path.join(".", "src", "lib");

function build() {
    process.stdout.write("\x1Bc");
    console.log("Started building KMP libraries.");
    const result = spawnSync(
        "gradlew.bat",
        [":shared:jsBrowserProductionLibraryDistribution"],
        { cwd: pathFrontendBase, shell: true }
    );
    if (result.status !== 0) {
        console.log("Error building KMP libraries:");
        console.log(`${result.stderr?.toString()}`);
        console.log(`${result.stdout?.toString()}`);
        return;
    }
    console.log("Finished building KMP libraries.");

    const files = fs.readdirSync(pathFrontendSharedArtifacts);
    for (const file of files) {
        fs.copyFile(path.join(pathFrontendSharedArtifacts, file), path.join(pathBackendLib, file),
            (error) => {
                if (error) {
                    throw error;
                }
            }
        );
    }
    console.log(`Copied KMP library (${files.length} files) to the lib folder.`);
}

const walk = function (dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

function addCameras(objFilename, injectedCode) {
    const startDirective = `// start-inject-cameras ${objFilename}`;
    const endDirective = `// end-inject-cameras ${objFilename}`;
    const files = walk(pathProjectSources);
    let modified = false;

    for (const file of files) {
        const contents = fs.readFileSync(file, "utf8");
        if (contents.includes(startDirective) && contents.includes(endDirective)) {
            const offset = getLineOffset(contents, startDirective);
            const strStart = contents.substring(0, contents.indexOf(startDirective) + startDirective.length + 1);
            const strEnd = contents.substring(contents.indexOf(endDirective));
            const paddingString = "".padStart(offset, " ");
            const paddedCode = paddingString + injectedCode.replaceAll("\n", "\n" + paddingString);
            const newContents = strStart + paddedCode + strEnd;
            fs.writeFileSync(file, newContents);
            modified = true;
        }
    }

    return modified;
}

function getLineOffset(contents, directive) {
    const lines = contents.split("\n");
    for (const line of lines) {
        const index = line.indexOf(directive);
        if (index !== -1) {
            return index;
        }
    }
    return 0;
}

function parseObjCameras(objFilename) {
    const contents = fs.readFileSync(objFilename, "utf8");
    const lines = contents.split("\n");

    const parseShape = (shapeName) => {
        const result = [];

        const NUMERIC_REGEXP = /[-]{0,1}[\d]*[,]?[\d]*[.]{0,1}[\d]+/g;

        let foundShape = false;
        for (const line of lines) {
            if (line.includes(`shape ${shapeName}`)) {
                foundShape = true;
            }
            if (foundShape) {
                if (result.length < 2) {
                    if (line.startsWith("v")) {
                        const numbers = line.match(NUMERIC_REGEXP).map(x => `${x}f`);
                        result.push(numbers);
                    }
                } else {
                    break;
                }
            }
        }

        return result;
    }

    const findAllShapeIndices = () => {
        const SHAPE_REGEXP = /shape CameraPath\w+/g;
        return contents.match(SHAPE_REGEXP).map(s => +s.replace("shape CameraPath", ""));
    }

    const indices = findAllShapeIndices();
    const cameras = indices.map(index => ({
        eye: parseShape(`CameraPath${index}`),
        lookat: parseShape(`TargetPath${index}`)
    }));

    return cameras;
}

function camerasToKotlin(cameras) {
    let result = "arrayOf<CameraPositionPair>(\n";

    for (const camera of cameras) {
        result += `    CameraPositionPair(
        CameraPosition(
            Vec3(${camera.eye[0].join(", ")}), // pos
            Vec3(${camera.lookat[0].join(", ")}), // target
        ),
        CameraPosition(
            Vec3(${camera.eye[1].join(", ")}), // pos
            Vec3(${camera.lookat[1].join(", ")}) // target
        ),
        1f
    ),
`;
    }

    result += ")\n";

    return result;
}

if (startServer) {
    const serverProcess = exec("npm", ["start"]);
    serverProcess.on("error", e => console.log(e));
    process.on("SIGINT", () => serverProcess.kill());
    process.on("SIGTERM", () => serverProcess.kill());
    console.log("Started HTTP dev server.");
}

let watcherObj;
let watcherKotlin;

if (fs.existsSync(pathProjectData)) {
    nsfw(
        path.resolve(pathProjectData),
        (_events) => {
            const files = fs.readdirSync(pathProjectData);
            console.log("Detected changes in OBJ files: " + files);
            for (const file of files) {
                const cameras = parseObjCameras(path.join(pathProjectData, file));
                const code = camerasToKotlin(cameras);
                addCameras(file, code);
            }
        })
        .then(function (newWatcher) {
            watcherObj = newWatcher;
            return watcherObj.start();
        })
        .then(function () {
            // we are now watching dir1 for events!
            // To stop watching
            // watcher.stop()
        });
    console.log("Watching data:", path.resolve(pathProjectData));
} else {
    console.log("Data NOT FOUND, not watching:", path.resolve(pathProjectData));
}

nsfw(
    path.resolve(pathProjectSources),
    (_events) => {
        console.log("Detected changes in project source files.");
        build();
    })
    .then(function (newWatcher) {
        watcherKotlin = newWatcher;
        return watcherKotlin.start();
    });
console.log("Watching project sources:", path.resolve(pathProjectSources));

nsfw(
    path.resolve(pathEngineSources),
    (_events) => {
        console.log("Detected changes in engine source files.");
        build();
    })
    .then(function (newWatcher) {
        watcherKotlin = newWatcher;
        return watcherKotlin.start();
    });
console.log("Watching engine sources:", path.resolve(pathEngineSources));

console.log("Started watcher.");
