import { Generator, LinearInterpolation, PerlinNoise, FadeFunction, CosineInterpolation } from '/noise.js';

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
        
        let generator = new Generator(100, 200);
        this.seeds = generator.PseudoRandomNumberGenerator(this.width);
        this.LERPPoints = [];
        this.fadedPoints = [];
    }

    create () {
        console.log(this.seeds);

        this.draw(seedsCtx, this.seeds, true);
    }

    drawInterpolationPoints () {
        this.seeds.reduce((p1, p2) => {
            for (let i = .1; i <= 1; i += .1) {
                this.LERPPoints.push(CosineInterpolation(p1, p2, i));
            }
            return p2;
        });

        this.draw(scene, this.LERPPoints, false);
    }

    drawFadedPoints () {
        this.fadedPoints = this.seeds.map(point => FadeFunction(point / 100) + this.height / 2);

        this.draw(scene2, this.fadedPoints, false);
    }

    draw(panel, points, pointsShow) {
        panel.strokeStyle = `red`;
        panel.fillStyle = `red`;
        panel.beginPath();
        // panel.lineTo(0, (this.height >> 1) + ((Math.max(...points) * this.height) >> 1) - points[0] * this.height);

        let stepSize = this.width / (points.length - 1);
        points.forEach((noise, index) => {
            panel.lineTo(Math.floor(stepSize * index), noise + this.height >> 1);
            if (pointsShow) {
                scene.arc(stepSize * index, (this.height >> 1) + ((Math.max(...this.LERPPoints) * this.height) >> 1) - noise * this.height, 3, 0, Math.PI * 2);
            }
        });
        panel.stroke();
    }
}

// function loop() {
//     seedsCtx.fillStyle = 'rgba(0, 0, 0, .5)';
//     scene2.fillStyle = 'rgba(0, 0, 0, .5)';
//     scene2.fillRect(0, 0, scene2Canvas.width, scene2Canvas.height);
//     seedsCtx.fillRect(0, 0, seedsCanvas.width, seedsCanvas.height);
//     const seedsGraph = new SeedsGraph(20);
//     seedsGraph.create();
//     seedsGraph.drawFadedPoints(); // Smoothly
//     // requestAnimationFrame(loop);
// }

// loop();

seedsCtx.fillStyle = 'rgba(0, 0, 0, .5)';
    scene2.fillStyle = 'rgba(0, 0, 0, .5)';
    scene2.fillRect(0, 0, scene2Canvas.width, scene2Canvas.height);
    seedsCtx.fillRect(0, 0, seedsCanvas.width, seedsCanvas.height);
    const seedsGraph = new SeedsGraph(20);
    seedsGraph.create();
    seedsGraph.drawFadedPoints(); // Smoothly

    // seedsGraph.drawInterpolationPoints();
    
    let perlinNoise = PerlinNoise(seedsGraph.seeds, 4, .5);
console.log()
seedsGraph.draw(scene, perlinNoise, false);




