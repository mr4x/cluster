export const $ = (selector, scope = document) => scope.querySelector(selector);

export const round = x => x.toFixed(2);

export const M = (rows, cols, v = 0) =>
    Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(v));

export const V = (n, v = 0) => Array(n).fill(v);

export const minMax = arr => [Math.min(...arr), Math.max(...arr)];

export const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

export function createCanvas(size) {
    const $canvas = document.createElement('canvas');
    $canvas.width = size;
    $canvas.height = size;
    $canvas.style.width = `${size}px`;
    $canvas.style.height = `${size}px`;
    document.body.appendChild($canvas);
    return $canvas;
}

export function text(ctx, x, y, text) {
    ctx.font = "12px '72', Arial, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}

export function maxDepth(tree) {
    if (tree.children.length === 0) return 0;
    return Math.max(...tree.children.map(c => maxDepth(c) + 1));
}

export function findLimits(points) {
    let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity,
        minZ = Infinity,
        maxZ = -Infinity;

    for (const p of points) {
        const x = p.x;
        const y = p.y;
        const z = p.z;

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
    }

    return { minX, minY, minZ, maxX, maxY, maxZ };
}

export function unionLimits(a, b) {
    return {
        minX: Math.min(a.minX, b.minX),
        minY: Math.min(a.minY, b.minY),
        minZ: Math.min(a.minZ, b.minZ),
        maxX: Math.max(a.maxX, b.maxX),
        maxY: Math.max(a.maxY, b.maxY),
        maxZ: Math.max(a.maxZ, b.maxZ),
    };
}

export function normalize(arr) {
    const [min, max] = minMax(arr);
    const d = max - min;
    return arr.map(x => (x - min) / d);
}

export function normalizeByColumn(mat) {
    const xs = normalize(mat.map(v => v[0]));
    const ys = normalize(mat.map(v => v[1]));
    const zs = normalize(mat.map(v => v[2]));

    return xs.map((_, i) => [xs[i], ys[i], zs[i]]);
}

export function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
