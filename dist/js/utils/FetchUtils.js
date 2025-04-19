"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchArrayBuffer = void 0;
async function fetchArrayBuffer(url) {
    const response = await fetch(url);
    const result = await response.arrayBuffer();
    return result;
}
exports.fetchArrayBuffer = fetchArrayBuffer;
//# sourceMappingURL=FetchUtils.js.map