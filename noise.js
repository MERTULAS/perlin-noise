function SeedGenerator (seedLength) {
    return Array.from({length: seedLength}, () => Math.random());
}

function LinearInterpolation(p1, p2, t) {
    return (1 - t) * p1 + t * p2;
}

function PerlinNoise (count, seeds, nOctaves) {
    const LERP = LinearInterpolation;
    const perlin = [];

    for (let x = 0; x < count; x++) {
        let noise = 0;
        let scale = 1;
        let scaleAcc = 0;

        for (let j = 0; j < nOctaves; j++) {
            let pitch = count >> j;
            let sample1 = (x / pitch) * pitch;
            let sample2 = (sample1 + pitch ) % count;

            let blend = (x - sample1) / pitch;
            let sample = LERP(seeds[sample1], seeds[sample2], blend);
            noise += sample * scale;
            scaleAcc += scale;
            scale >>= 1;
        }

        perlin[x] = noise / scaleAcc;
    }

    return perlin;
}

export {
    SeedGenerator,
    LinearInterpolation,
    PerlinNoise
}