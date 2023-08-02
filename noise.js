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
                yPoint = firstPoint * this.amplitude;
            }

            else {
                yPoint = this.INTERPOLATION(firstPoint, secondPoint, (xPoint % this.waveLength) / this.waveLength) * this.amplitude;
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

function PerlinNoise (seeds, nOctaves, amplitude, interpolation = 'lerp') {
    const INTERPOLATION = interpolation === 'lerp' ? LinearInterpolation : CosineInterpolation;
    let perlin = seeds;

    let totalSeedCount = seeds.length;
    let tempOctave = nOctaves;
    let coefficient = 1;
    while (tempOctave > 0) {
        for (let octaveStep = 0; octaveStep <= totalSeedCount; octaveStep+= tempOctave) {
            perlin[octaveStep] += amplitude * coefficient * seeds[octaveStep];
        }
        tempOctave >>= 1;
        coefficient /= 2;
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