import rough from 'roughjs/bundled/rough.esm';
import { agnes } from 'ml-hclust';

import { T, U } from './data';
import { Color } from './colors';
import { minMax, createCanvas, avg, maxDepth, text, round } from './utils';
import { kMeans } from './kmeans';
import { drawPlot } from './plot';
import { forel } from './forel';

const SIZE = 800;
const OFFSET = 16;
const DELAY = 2000;
const SHOW_LABELS = false;

const [minX, maxX] = minMax(T.map(r => r[1]));
const [minY, maxY] = minMax(T.map(r => r[2]));

console.log({ minX, maxX, minY, maxY });

const mx = x => OFFSET + ((x - minX) * SIZE) / (maxX - minX);
const my = x => SIZE + OFFSET - ((x - minY) * SIZE) / (maxY - minY);

const rmx = x => minX + ((x - OFFSET) * (maxX - minX)) / SIZE;
const rmy = x => minY + ((SIZE + OFFSET - x) * (maxY - minY)) / SIZE;

function drawTree(rc, node, depth, maxDepth) {
    for (const child of node.children) {
        drawTree(rc, child, depth + 1, maxDepth);
    }

    if (node.index >= 0) {
        const o = T[node.index];
        node.x = mx(o[1]);
        node.y = my(o[2]);
        rc.circle(node.x, node.y, OFFSET, { fill: Color.BLUE(), stroke: Color.BLUE() });
        if (SHOW_LABELS) text(rc.ctx, node.x, node.y, `${round(o[1])},${round(o[2])}`);
    } else {
        const cx = node.children.map(c => c.x);
        const cy = node.children.map(c => c.y);
        node.x = avg(cx);
        node.y = avg(cy);

        setTimeout(() => {
            const alpha = (maxDepth - depth) / maxDepth;
            rc.rectangle(node.x - OFFSET / 2, node.y - OFFSET / 2, OFFSET, OFFSET, {
                fill: Color.RED(alpha),
                stroke: Color.RED(alpha),
            });
            for (let i = 0; i < cx.length; i++) {
                rc.line(node.x, node.y, cx[i], cy[i], { stroke: Color.BLACK(alpha * 0.5) });
            }
            if (SHOW_LABELS) text(rc.ctx, node.x, node.y, `${round(rmx(node.x))},${round(rmy(node.y))}`);
        }, (maxDepth - depth) * DELAY);
    }
}

// FAR

const root1 = agnes(
    T.map(r => [r[1], r[2]]),
    { method: 'complete' }
);
const maxDepth1 = maxDepth(root1);
console.log(root1, maxDepth1);

const rc1 = rough.canvas(createCanvas(SIZE + 2 * OFFSET));
rc1.rectangle(OFFSET, OFFSET, SIZE, SIZE, { stroke: Color.BLACK(0.1) });
drawTree(rc1, root1, 0, maxDepth1);

// NEAR

const root2 = agnes(
    T.map(r => [r[1], r[2]]),
    { method: 'single' }
);
const maxDepth2 = maxDepth(root2);
console.log(root2, maxDepth2);

const rc2 = rough.canvas(createCanvas(SIZE + 2 * OFFSET));
rc2.rectangle(OFFSET, OFFSET, SIZE, SIZE, { stroke: Color.BLACK(0.1) });
drawTree(rc2, root2, 0, maxDepth2);

// K-MEANS

const rc3 = rough.canvas(createCanvas(SIZE + 2 * OFFSET));

kMeans(
    T.map(r => [r[1], r[2]]),
    5,
    (centroids, classes, step) => {
        setTimeout(() => {
            rc3.ctx.clearRect(0, 0, OFFSET * 2 + SIZE, OFFSET * 2 + SIZE);
            rc3.rectangle(OFFSET, OFFSET, SIZE, SIZE, { stroke: Color.BLACK(0.1) });
            for (const r of T) {
                const x = mx(r[1]);
                const y = my(r[2]);
                rc3.circle(x, y, OFFSET, { fill: Color.BLUE(), stroke: Color.BLUE() });
                if (SHOW_LABELS) text(rc3.ctx, x, y, `${round(rmx(x))},${round(rmy(y))}`);
            }

            for (let j = 0; j < centroids.length; j++) {
                const c = centroids[j];
                const x = mx(c[0]);
                const y = my(c[1]);

                rc3.rectangle(x - OFFSET / 2, y - OFFSET / 2, OFFSET, OFFSET, {
                    fill: Color.RED(),
                    stroke: Color.RED(),
                });

                for (let i = 0; i < classes.length; i++) {
                    if (classes[i] !== j) continue;
                    const o = T[i];
                    rc3.line(mx(o[1]), my(o[2]), x, y, { stroke: Color.GOLD(0.4) });
                }
                if (SHOW_LABELS) text(rc3.ctx, x, y, `${round(rmx(x))},${round(rmy(y))}`);
            }
        }, DELAY * step);
    }
);

// Поиск сгущений

const radius = 0.3;
const points = U.map(p => ({ x: p[0], y: p[1], z: p[2] }));
const cores = forel(U, radius);
console.log(cores);

drawPlot(createCanvas(SIZE + 2 * OFFSET), [
    {
        points,
        centerColor: Color.BLUE(0.5),
        centerRadius: 0.01,
    },
    {
        points: cores,
        radius,
        color: Color.GOLD(0.2),
        centerColor: Color.RED(1),
        centerRadius: 0.01,
    },
]);
