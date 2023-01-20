import { SeedGenerator, LinearInterpolation, PerlinNoise } from '/noise.js';

// init seeds
const seedsCanvas = document.getElementById('seeds');
const seedsCtx = seedsCanvas.getContext('2d');
const seedsRect = {
    width: seedsCanvas.getBoundingClientRect().width,
    height: seedsCanvas.getBoundingClientRect().height
}
seedsCanvas.width = seedsRect.width;
seedsCanvas.height = seedsRect.height;


// init scene
const sceneCanvas = document.getElementById('scene');
const scene = sceneCanvas.getContext('2d');
const sceneRect = {
    width: sceneCanvas.getBoundingClientRect().width,
    height: sceneCanvas.getBoundingClientRect().height
}
sceneCanvas.width = sceneRect.width;
sceneCanvas.height = sceneRect.height;

class SeedsGraph {
    constructor (seedCount) {
        this.width = seedsRect.width;
        this.height = seedsRect.height;
        this.seeds = [];
        this.seedCount = seedCount;
        this.seeds = SeedGenerator(this.seedCount);
    }

    create () {
        
        seedsCtx.strokeStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        seedsCtx.fillStyle = "red"
        seedsCtx.font = "20px Arial";
        seedsCtx.beginPath();
        seedsCtx.moveTo(0, (this.height >> 1) + ((Math.max(...this.seeds) * this.height) >> 1) - this.seeds[0] * this.height);

        let stepSize = this.width / (this.seedCount - 1);
        this.seeds.forEach((seed, index) => {
            seedsCtx.lineTo(stepSize * index, (this.height >> 1) + ((Math.max(...this.seeds) * this.height) >> 1) - seed * this.height);
            // seedsCtx.fillText(parseFloat(seed).toFixed(2), 5 + stepSize * index, (this.height >> 1) + ((Math.max(...this.seeds) * this.height) >> 1) - seed * this.height);
        });
        seedsCtx.stroke();
    }    
}

class Sample {
    constructor (noises) {
        this.width = sceneRect.width;
        this.height = sceneRect.height;
        this.noises = noises;
        this.seedCount = noises.length;
    }

    create () {

        scene.strokeStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        scene.beginPath();
        scene.moveTo(0, (this.height >> 1) + ((Math.max(...this.noises) * this.height) >> 1) - this.noises[0] * this.height);

        let stepSize = this.width / (this.seedCount - 1);
        this.noises.forEach((noise, index) => {
            scene.lineTo(stepSize * index, (this.height >> 1) + ((Math.max(...this.noises) * this.height) >> 1) - noise * this.height);
        });
        scene.stroke();
    }    
}


const seedsGraph = new SeedsGraph(20);
seedsGraph.create();
let perlinNoise = PerlinNoise(10, seedsGraph.seeds, 4)

const sampleGraph = new Sample(perlinNoise);
sampleGraph.create();


