import { SeedGenerator, LinearInterpolation, PerlinNoise, FadeFunction } from '/noise.js';

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

// init scene2
const scene2Canvas = document.getElementById('scene2');
const scene2 = scene2Canvas.getContext('2d');
const scene2Rect = {
    width: scene2Canvas.getBoundingClientRect().width,
    height: scene2Canvas.getBoundingClientRect().height
}
scene2Canvas.width = scene2Rect.width;
scene2Canvas.height = scene2Rect.height;

class SeedsGraph {
    constructor (seedCount) {
        this.width = seedsRect.width;
        this.height = seedsRect.height;
        this.seeds = [];
        this.seedCount = seedCount;
        this.seeds = SeedGenerator(this.seedCount);
        this.LERPPoints = [];
        this.fadedPoints = [];
    }

    create () {
        this.#draw(seedsCtx, this.seeds, true);
    }

    drawInterpolationPoints () {
        this.seeds.reduce((p1, p2) => {
            for (let i = .1; i <= .9; i += .1) {
                this.LERPPoints.push(LinearInterpolation(p1, p2, i));
            }
            return p2;
        });

        this.#draw(scene, this.LERPPoints, true);
    }

    drawFadedPoints () {
        this.fadedPoints = this.LERPPoints.map(point => FadeFunction(point));

        this.#draw(scene2, this.fadedPoints, false);
    }

    #draw(panel, points, pointsShow) {
        panel.strokeStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        panel.fillStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        panel.beginPath();
        panel.lineTo(0, (this.height >> 1) + ((Math.max(...points) * this.height) >> 1) - points[0] * this.height);

        let stepSize = this.width / (points.length - 1);
        points.forEach((noise, index) => {
            panel.lineTo(stepSize * index, (this.height >> 1) + ((Math.max(...points) * this.height) >> 1) - noise * this.height);
            if (pointsShow) {
                scene.arc(stepSize * index, (this.height >> 1) + ((Math.max(...this.LERPPoints) * this.height) >> 1) - noise * this.height, 3, 0, Math.PI * 2);
            }
        });
        panel.stroke();
    }
}

const seedsGraph = new SeedsGraph(20);
seedsGraph.create();
seedsGraph.drawInterpolationPoints();
seedsGraph.drawFadedPoints(); // Smoothly

let perlinNoise = PerlinNoise(12, seedsGraph.seeds, 4)


