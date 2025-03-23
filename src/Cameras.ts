export const CAMERAS = [
    {
        name: "flying towards hill above water, from the right", // CAM1
        start: {
            position: new Float32Array([4.84, -644.785, -25.362]),
            rotation: new Float32Array([4.673, -1.741, 4.447])
        },
        end: {
            position: new Float32Array([2.56, -126.0, -8.595]),
            rotation: new Float32Array([2.533, -1.741, 3.993])
        },
        speedMultiplier: 1.0,
        interactive: false
    },
    {
        name: "pan right", // CAM2
        start: {
            position: new Float32Array([-137, -115, -12]),
            rotation: new Float32Array([3.485, -0.679, -16.321])
        },
        end: {
            position: new Float32Array([138, -110, 20]),
            rotation: new Float32Array([3.485, -0.679, -16.321])
        },
        speedMultiplier: 1.0,
        interactive: true
    },
    {
        name: "pan right-front", // CAM3
        start: {
            position: new Float32Array([208, -208, -21]),
            rotation: new Float32Array([0, 0, 0])
        },
        end: {
            position: new Float32Array([265, 77, 22]),
            rotation: new Float32Array([0, 0, -35])
        },
        speedMultiplier: 1.0,
        interactive: true
    },
    {
        name: "pan left w/o rotation", // CAM4
        start: {
            position: new Float32Array([347, 73, 15]),
            rotation: new Float32Array([161, -220, -19])
        },
        end: {
            position: new Float32Array([69, 365, 15]),
            rotation: new Float32Array([-100, 162, -18])
        },
        speedMultiplier: 1.0,
        interactive: true
    },
    {
        name: "pan left w/ rotation", // CAM5
        start: {
            position: new Float32Array([147, 212, 0]),
            rotation: new Float32Array([20, -10, 7])
        },
        end: {
            position: new Float32Array([-146, 182, 30]),
            rotation: new Float32Array([-20, 4, -35])
        },
        speedMultiplier: 1.0,
        interactive: true
    },
    {
        name: "pan rear left to right", // CAM6
        start: {
            position: new Float32Array([-244, 139, 77]),
            rotation: new Float32Array([-3, -27, -37])
        },
        end: {
            position: new Float32Array([-151, -357, 11]),
            rotation: new Float32Array([20, -45, 0])
        },
        speedMultiplier: 1.0,
        interactive: true
    },
    {
        name: "fly rear", // CAM7
        start: {
            position: new Float32Array([-265, -158, -20]),
            rotation: new Float32Array([0, 0, 32])
        },
        end: {
            position: new Float32Array([-95, -70, 0]),
            rotation: new Float32Array([9, -13, -10])
        },
        speedMultiplier: 1.0,
        interactive: false
    },
];

const logCamerasJava = () => {
    let result = "";
    for (const camera of CAMERAS) {
        result += `
        new CameraPositionPair() {{
            start = new CameraPosition() {{
                position = new Point3D(${camera.start.position});
                rotation = new Point3D(${camera.start.rotation});
            }};
            end = new CameraPosition() {{
                position = new Point3D(${camera.end.position});
                rotation = new Point3D(${camera.end.rotation});
            }};
            speedMultiplier = ${camera.speedMultiplier}f;
        }},
        `;
    }
    return result;
}
(window as any).camerasString = logCamerasJava();
