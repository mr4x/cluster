import { M, V } from './utils';

export const kMeans = (data, k = 1, cb) => {
    const centroids = data.slice(0, k);
    const distances = M(data.length, k);
    const classes = V(data.length, -1);
    let itr = true;
    let step = 0;

    cb && cb(centroids.slice(), classes.slice(), step);

    while (itr) {
        itr = false;
        step++;

        for (let d in data) {
            for (let c = 0; c < k; c++) {
                distances[d][c] = Math.hypot(...Object.keys(data[0]).map(key => data[d][key] - centroids[c][key]));
            }

            const m = distances[d].indexOf(Math.min(...distances[d]));
            if (classes[d] !== m) itr = true;
            classes[d] = m;
        }

        for (let c = 0; c < k; c++) {
            centroids[c] = V(data[0].length, 0);
            const size = data.reduce((acc, _, d) => {
                if (classes[d] === c) {
                    acc++;
                    for (let i in data[0]) centroids[c][i] += data[d][i];
                }
                return acc;
            }, 0);

            for (let i in data[0]) {
                centroids[c][i] = centroids[c][i] / size;
            }
        }
        cb && cb(centroids.slice(), classes.slice(), step);
    }

    return classes;
};
