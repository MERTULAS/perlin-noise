class Generator {
    constructor(waveLength, amplitude, height) {
        this.waveLength = waveLength;
        this.amplitude = amplitude;
        this.frequency = 1 / this.waveLength;
        this.height = height;
        this.INTERPOLATION = CosineInterpolation;
    }

    PseudoRandomNumberGenerator(numberLength) {
        var M = 4294967296,
        A = 1664525,
        C = 1;
        var Z = Math.floor(Math.random() * M);
        
        function rand(){
            Z = (A * Z + C) % M;
            return Z / M - 0.5;
        }

        const result = [];

        let firstPoint = rand(), secondPoint = rand(), yPoint;
        
        
        for (let xPoint = 0; xPoint < numberLength; xPoint++) {
            if (xPoint % this.waveLength === 0) {
                firstPoint = secondPoint;
                secondPoint = rand();
                yPoint = (this.height / 2) + firstPoint * this.amplitude;
            }

            else {
                yPoint = (this.height / 2)  + this.INTERPOLATION(firstPoint, secondPoint, (xPoint % this.waveLength) / this.waveLength) * this.amplitude;
            }
            
            result.push(yPoint);
        }
    
        return result;
    };

    RandomSeedGenerator (seedLength) {
        return Array.from({length: seedLength}, () => Math.random());
    }
}


function LinearInterpolation(p1, p2, t) {
    return (1 - t) * p1 + t * p2;
}

function CosineInterpolation(p1, p2, t) {
    let ft = t * Math.PI;
    let f = (1-Math.cos(ft)) * .5;
    return (1 - f) * p1 + f * p2;
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

function FadeFunction (t) {
    return 6 * Math.pow(t, 5) - 15 * Math.pow(t, 4) + 10 * Math.pow(t, 3);
}

export {
    Generator,
    LinearInterpolation,
    PerlinNoise,
    FadeFunction,
    CosineInterpolation
}