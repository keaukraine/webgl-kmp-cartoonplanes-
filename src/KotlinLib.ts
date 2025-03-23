import * as lib from "./lib/KMP-library-shared";

const engine = (lib as any).default.org.androidworks.engine as typeof lib.org.androidworks.engine;
const example = (lib as any).default.org.androidworks.example as typeof lib.org.androidworks.example;
const cartoonplanes = (lib as any).default.org.androidworks.cartoonplanes as typeof lib.org.androidworks.cartoonplanes;

export { engine, example, cartoonplanes, lib };
