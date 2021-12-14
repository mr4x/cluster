import { randInt, avg } from './utils';

const EPS = 1e-9;

const eq = (a, b) => Math.max(...[a[0] - b[0], a[1] - b[1], a[2] - b[2]].map(Math.abs)) < EPS;

const getNeighbourObjects = (center, objects, r) =>
    objects.filter(o => Math.hypot(o[0] - center[0], o[1] - center[1], o[2] - center[2]) <= r);

function centerOfObjects(objects) {
    const x = avg(objects.map(o => o[0]));
    const y = avg(objects.map(o => o[1]));
    const z = avg(objects.map(o => o[2]));
    return [x || 0, y || 0, z || 0];
}

export function forel(data, r, cb) {
    let objects = data.slice();
    let cores = [];

    while (objects.length > 0) {
        let currentObject = objects[randInt(0, objects.length)];
        let neighbourObjects = getNeighbourObjects(currentObject, objects, r);
        let centerObject = centerOfObjects(neighbourObjects);

        while (!eq(centerObject, currentObject)) {
            currentObject = centerObject;
            neighbourObjects = getNeighbourObjects(currentObject, objects, r);
            centerObject = centerOfObjects(neighbourObjects);
        }

        cb && cb(centerObject);
        cores.push(centerObject);

        objects = objects.filter(o => !neighbourObjects.some(n => eq(o, n)));
    }

    return cores.map(c => ({ x: c[0], y: c[1], z: c[2] }));
}
