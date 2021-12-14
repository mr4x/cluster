import Zdog from 'zdog';

import { Color } from './colors';
import { findLimits, unionLimits } from './utils';

const SIZE = 300;

export function drawPlot(element, data) {
    const { minX, minY, minZ, maxX, maxY, maxZ } = unionLimits(findLimits(data[0].points), findLimits(data[1].points));
    console.log({ minX, minY, minZ, maxX, maxY, maxZ });
    const minCoord = Math.min(minX, minY, minZ);

    const maxDiff = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
    console.log(maxDiff);

    const proj = r => ((r - minCoord) * SIZE) / maxDiff;
    console.log(proj(0.4));

    const illo = new Zdog.Illustration({
        element,
        rotate: { y: Zdog.TAU / 8, x: -Zdog.TAU / 12, z: Zdog.TAU / 2 },
        dragRotate: true,
    });

    new Zdog.Shape({
        addTo: illo,
        stroke: 2,
        path: [{}, { x: SIZE }],
        color: Color.RED(),
    });

    new Zdog.Shape({
        addTo: illo,
        stroke: 2,
        path: [{}, { y: SIZE }],
        color: Color.GREEN(),
    });

    new Zdog.Shape({
        addTo: illo,
        stroke: 2,
        path: [{}, { z: SIZE }],
        color: Color.BLUE(),
    });

    for (const set of data) {
        for (const p of set.points) {
            new Zdog.Shape({
                addTo: illo,
                stroke: proj(set.centerRadius * 2),
                translate: { x: proj(p.x), y: proj(p.y), z: proj(p.z) },
                color: set.centerColor,
            });

            if (set.color && set.radius) {
                new Zdog.Shape({
                    addTo: illo,
                    stroke: proj(set.radius * 2),
                    translate: { x: proj(p.x), y: proj(p.y), z: proj(p.z) },
                    color: set.color,
                });
            }
        }
    }

    function animate() {
        illo.updateRenderGraph();
        requestAnimationFrame(animate);
    }
    animate();

    return illo;
}
