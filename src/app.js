"use strict";
import * as helpers from './helpers';

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    let pixelRatios;
    let center = {};

    let circles = [{
        radius: 400,
        points: Array.from(new Array(6), () => new Object({
            x: 0,
            y: 0,
            angle: 0
        }))
    }, {
        radius: 0,
        points: Array.from(new Array(3), () => new Object({
            x: 0,
            y: 0,
            angle: 0
        }))
    }, {
        radius: 0,
        points: Array.from(new Array(3), () => new Object({
            x: 0,
            y: 0,
            angle: 0
        }))
    }];

    document.querySelector('body').appendChild(canvas);

    updateSizes();
    initPoints();
    animate();

    window.addEventListener('resize', updateSizes);

    function animate() {
        clearCanvas();
        draw();

        window.requestAnimationFrame(animate);
    }

    function draw() {
        // debug
        for (let circle of circles) {
            for (let point of circle.points) {
                drawCircle(point.x + center.x, point.y + center.y);
            }
        }

        joinPoints();

        // update points
        for (let point of circles[0].points) {
            // if (i % 2 === 0) {

            // } else {

            // }
            // point.angle += 0.1;
            // let newPointPosition = helpers.getCoordsOnCircle(point.angle, circles[0].radius);

            // point.x = newPointPosition.x;
            // point.y = newPointPosition.y;
        }
    }

    function initPoints() {
        // init outer points position
        for (let i = 0; i < circles[0].points.length; i++) {
            let angle;

            if (i === 0) {
                angle = -90;
            } else {
                angle = circles[0].points[i - 1].angle + 360 / circles[0].points.length;
            }

            circles[0].points[i] = helpers.getCoordsOnCircle(angle, circles[0].radius);
            circles[0].points[i].angle = angle;
        }
    }

    function joinPoints() {
        // outer points
        let outerPointsLength = circles[0].points.length;
        context.strokeStyle = "#fff";

        context.lineJoin = "round";
        context.lineWidth = 3;

        context.beginPath();

        for (let i = 0; i < outerPointsLength; i++) {
            let startPoint = circles[0].points[i];

            if (i === 0) {
                context.moveTo(startPoint.x + center.x, startPoint.y + center.y);
            }

            let endPoint = circles[0].points[(i + 1) % outerPointsLength];
            context.lineTo(endPoint.x + center.x, endPoint.y + center.y);
        }

        context.stroke();

        // middle points
        context.beginPath();

        let middlePointsLength = circles[1].points.length;

        for (let i = 0; i < middlePointsLength; i++) {
            let startPoint = circles[1].points[i];

            context.moveTo(startPoint.x + center.x, startPoint.y + center.y);

            let endPoint = circles[0].points[i * 2 + 1];
            context.lineTo(endPoint.x + center.x, endPoint.y + center.y);
        }

        context.stroke();

        // inner points
        context.beginPath();

        let innerPointsLength = circles[2].points.length;

        for (let i = 0; i < innerPointsLength; i++) {
            let startPoint = circles[2].points[i];

            context.moveTo(startPoint.x + center.x, startPoint.y + center.y);

            let endPoint = circles[1].points[(i + 1) % middlePointsLength];
            context.lineTo(endPoint.x + center.x, endPoint.y + center.y);
        }

        context.stroke();
    }

    function drawCircle(x, y, r = 5, strokeColor = "rgba(248,214,1, 1)", fillColor = "rgba(255, 255, 255, 0.5)") {
        context.fillStyle = fillColor;
        context.strokeStyle = strokeColor;

        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }

    function updateSizes() {
        pixelRatios = helpers.getPixelRatios(context);

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        if (pixelRatios.device !== pixelRatios.context) {
            canvas.height *= pixelRatios.ratio;
            canvas.width *= pixelRatios.ratio;
        }

        center.x = canvas.width / 2;
        center.y = canvas.height / 2;
    }

    function clearCanvas() {
        context.fillStyle = "rgba(40,43,64,0.8)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
});