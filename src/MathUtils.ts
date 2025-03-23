import { Point3D } from "./utils/Point3D";

/**
* findLinePlaneIntersectionCoords (to avoid requiring unnecessary instantiation)
* Given points p with px py pz and q that define a line, and the plane
* of formula ax+by+cz+d = 0, returns the intersection point or null if none.
*/
export function findLinePlaneIntersectionCoords(px: number, py: number, pz: number, qx: number, qy: number, qz: number, a: number, b: number, c: number, d: number) {
    var tDenom = a * (qx - px) + b * (qy - py) + c * (qz - pz);
    if (tDenom == 0) {
        return null;
    }

    var t = - (a * px + b * py + c * pz + d) / tDenom;

    return {
        x: (px + t * (qx - px)),
        y: (py + t * (qy - py)),
        z: (pz + t * (qz - pz))
    };
}

export function lerp(start: number, end: number, m: number) {
    return (1 - m) * start + m * end;
}

export function angleBetweenPoints(start: Point3D, end: Point3D, result: Point3D): Point3D {
    result.x = Math.atan2(start.z - end.z, start.y - end.y); // * 180 / Math.PI; // x axis
    result.y = Math.atan2(start.z - end.z, start.x - end.x); // * 180 / Math.PI; // y axis
    result.z = Math.atan2(start.x - end.x, start.y - end.y); // * 180 / Math.PI; // z axis
    return result;
}
