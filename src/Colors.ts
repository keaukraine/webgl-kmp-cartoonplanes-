export interface SceneColors {
    isDay: boolean;
    drawSmallSun: boolean;
    drawStars: boolean;
    sky: number[];
    hillDark: number[];
    hillBright: number[];
    mountainsDark: number[];
    mountainsBright: number[];
    ground1: number[];
    ground2: number[];
    water: number[];
    waterHighlight: number[];
    sun: number[];
    stars: number[];
    clouds: number[];
    animal: number[];
    birds: number[];
    hills: number[];
}

export const COLORS: SceneColors[] = [
    {  // day
        isDay: true,
        drawSmallSun: true,
        drawStars: false,
        sky: [143 / 256, 194 / 256, 225 / 256, 1.0],
        hillDark: [69 / 256, 68 / 256, 61 / 256, 0],
        hillBright: [97 / 256, 96 / 256, 87 / 256, 0],
        mountainsDark: [109 / 256, 161 / 256, 189 / 256, 1],
        mountainsBright: [141 / 256, 180 / 256, 199 / 256, 1],
        ground1: [40 / 256, 92 / 256, 65 / 256, 1],
        ground2: [85 / 256, 148 / 256, 161 / 256, 1],
        water: [143 / 256, 194 / 256, 209 / 256, 1],
        waterHighlight: [191 / 256, 219 / 256, 236 / 256, 1],
        sun: [255 / 256, 255 / 256, 221 / 256, 1],
        stars: [0, 0, 0, 0],
        clouds: [228 / 256, 241 / 256, 247 / 256, 1],
        animal: [42 / 256, 38 / 256, 30 / 256, 1],
        birds: [68 / 256, 62 / 256, 49 / 256, 1],
        hills: [23 / 256, 69 / 256, 61 / 256, 1]
    },
    { // night
        isDay: false,
        drawSmallSun: true,
        drawStars: true,
        sky: [0 / 256, 37 / 256, 75 / 256, 1.0],
        hillDark: [10 / 256, 45 / 256, 64 / 256, 1],
        hillBright: [0 / 256, 81 / 256, 124 / 256, 0],
        mountainsDark: [1 / 256, 120 / 256, 167 / 256, 1],
        mountainsBright: [63 / 256, 175 / 256, 212 / 256, 1],
        ground1: [0 / 256, 58 / 256, 97 / 256, 1],
        ground2: [1 / 256, 91 / 256, 138 / 256, 1],
        water: [53 / 256, 132 / 256, 156 / 256, 1],
        waterHighlight: [98 / 256, 199 / 256, 227 / 256, 1],
        sun: [194 / 256, 228 / 256, 240 / 256, 1],
        stars: [194 / 256, 228 / 256, 240 / 256, 1],
        clouds: [44 / 256, 96 / 256, 145 / 256, 1],
        animal: [0 / 256, 23 / 256, 43 / 256, 1],
        birds: [255 / 256, 0 / 256, 0 / 256, 1],
        hills: [0 / 256, 41 / 256, 77 / 256, 1],
    },
    { // sunrise
        isDay: true,
        drawSmallSun: false,
        drawStars: false,
        sky: [186 / 256, 173 / 256, 141 / 256, 1.0],
        hillDark: [102 / 256, 85 / 256, 79 / 256, 1],
        hillBright: [132 / 256, 112 / 256, 104 / 256, 0],
        mountainsDark: [215 / 256, 194 / 256, 139 / 256, 1],
        mountainsBright: [219 / 256, 199 / 256, 158 / 256, 1],
        ground1: [116 / 256, 91 / 256, 71 / 256, 1],
        ground2: [143 / 256, 127 / 256, 95 / 256, 1],
        water: [189 / 256, 215 / 256, 232 / 256, 1],
        waterHighlight: [212 / 256, 232 / 256, 246 / 256, 1],
        sun: [227 / 256, 189 / 256, 111 / 256, 1],
        stars: [0, 0, 0, 0],
        clouds: [204 / 256, 193 / 256, 166 / 256, 1],
        animal: [69 / 256, 56 / 256, 49 / 256, 1],
        birds: [74 / 256, 60 / 256, 53 / 256, 1],
        hills: [93 / 256, 75 / 256, 66 / 256, 1]
    },
    { // sunset
        isDay: true,
        drawSmallSun: false,
        drawStars: false,
        sky: [206 / 256, 140 / 256, 132 / 256, 1.0],
        hillDark: [125 / 256, 60 / 256, 81 / 256, 1],
        hillBright: [137 / 256, 74 / 256, 89 / 256, 0],
        mountainsDark: [170 / 256, 116 / 256, 144 / 256, 1],
        mountainsBright: [198 / 256, 161 / 256, 173 / 256, 1],
        ground1: [110 / 256, 47 / 256, 80 / 256, 1],
        ground2: [146 / 256, 91 / 256, 118 / 256, 1],
        water: [180 / 256, 118 / 256, 120 / 256, 1],
        waterHighlight: [206 / 256, 140 / 256, 132 / 256, 1],
        sun: [229 / 256, 207 / 256, 186 / 256, 1],
        stars: [0, 0, 0, 0],
        clouds: [211 / 256, 159 / 256, 163 / 256, 1],
        animal: [74 / 256, 39 / 256, 51 / 256, 1],
        birds: [94 / 256, 45 / 256, 53 / 256, 1],
        hills: [93 / 256, 45 / 256, 70 / 256, 1]
    }
];
