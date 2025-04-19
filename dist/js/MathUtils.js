"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.angleBetweenPoints = exports.lerp = exports.findLinePlaneIntersectionCoords = void 0;
/**
* findLinePlaneIntersectionCoords (to avoid requiring unnecessary instantiation)
* Given points p with px py pz and q that define a line, and the plane
* of formula ax+by+cz+d = 0, returns the intersection point or null if none.
*/
function findLinePlaneIntersectionCoords(px, py, pz, qx, qy, qz, a, b, c, d) {
    var tDenom = a * (qx - px) + b * (qy - py) + c * (qz - pz);
    if (tDenom == 0) {
        return null;
    }
    var t = -(a * px + b * py + c * pz + d) / tDenom;
    return {
        x: (px + t * (qx - px)),
        y: (py + t * (qy - py)),
        z: (pz + t * (qz - pz))
    };
}
exports.findLinePlaneIntersectionCoords = findLinePlaneIntersectionCoords;
function lerp(start, end, m) {
    return (1 - m) * start + m * end;
}
exports.lerp = lerp;
function angleBetweenPoints(start, end, result) {
    result.x = Math.atan2(start.z - end.z, start.y - end.y); // * 180 / Math.PI; // x axis
    result.y = Math.atan2(start.z - end.z, start.x - end.x); // * 180 / Math.PI; // y axis
    result.z = Math.atan2(start.x - end.x, start.y - end.y); // * 180 / Math.PI; // z axis
    return result;
}
exports.angleBetweenPoints = angleBetweenPoints;
//# sourceMappingURL=MathUtils.js.map