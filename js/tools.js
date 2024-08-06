function switchTool(newTool) {
    if (currentTool === newTool) return;

    // 禁用所有工具
    isDrawingToolEnabled = false;
    isSmudgeToolEnabled = false;
    isBubbleToolEnabled = false;
    isBrushToolEnabled = false;
    isMopBrushEnabled = false;
    isSliceStrokeEnabled = false;
    isSprayToolEnabled = false; // 新增

    // 清除事件监听器
    if (currentTool !== null) {
        const toolHandlers = getToolHandlers(currentTool);
        if (toolHandlers) {
            removeToolEventListeners(toolHandlers);
        }

        if (currentTool === "bubble") {
            const bubbleCanvas = document.getElementById("bubbleCanvas");
            if (bubbleCanvas) {
                context.drawImage(bubbleCanvas, 0, 0);
                document.body.removeChild(bubbleCanvas);
            }
        }
    }

    // 重置 globalAlpha
    context.globalAlpha = 1;

    // 启用新工具
    updateCursorForTool(newTool);
    enableTool(newTool);

    currentTool = newTool;
}

function getToolHandlers(tool) {
    if (tool === "drawing") return initializeDrawingTool();
    if (tool === "smudge") return initializeSmudgeTool(canvas);
    if (tool === "bubble") return bubble();
    if (tool === "brush") return strokeBrush();
    if (tool === "mop") return mopbrush();
    if (tool === "slice") return sliceStroke(2); // 默认间隔2
    if (tool === "spray") return spray(); // 新增
    return null;
}


function enableTool(tool) {
    if (tool === "drawing") {
        isDrawingToolEnabled = true;
        currentImage.src='image/scraper.png';
    } else if (tool === "smudge") {
        isSmudgeToolEnabled = true;
        currentImage.src='image/too3.png';
        currentImage.style.scale = 0.9;
    } else if (tool === "bubble") {
        isBubbleToolEnabled = true;
        currentImage.src='image/sponge.png';
    } else if (tool === "brush") {
        isBrushToolEnabled = true;
        currentImage.src='image/too4.png';
    } else if (tool === "mop") {
        isMopBrushEnabled = true;
        currentImage.src='image/too5.png';
    } else if (tool === "slice") {
        isSliceStrokeEnabled = true;
        currentImage.src='image/too2.png';
    } else if (tool === "spray") { // 新增
        isSprayToolEnabled = true; // 新增
        currentImage.src='image/sprayer2.png';
    }
    const toolHandlers = getToolHandlers(tool);
    if (toolHandlers) {
        addToolEventListeners(toolHandlers);
    }
}



function addToolEventListeners(toolHandlers) {
    if (!toolHandlers) return;
    const { mouseMove, mouseDown, endStroke, mouseEnter, touchStart, touchMove, touchEnd } = toolHandlers;
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", endStroke);
    canvas.addEventListener("mouseout", endStroke);
    canvas.addEventListener("mouseenter", mouseEnter);
    canvas.addEventListener("touchstart", touchStart);
    canvas.addEventListener("touchend", touchEnd);
    canvas.addEventListener("touchcancel", touchEnd);
    canvas.addEventListener("touchmove", touchMove);
}

function removeToolEventListeners(toolHandlers) {
    if (!toolHandlers) return;
    const { mouseMove, mouseDown, endStroke, mouseEnter, touchStart, touchMove, touchEnd } = toolHandlers;
    canvas.removeEventListener("mousemove", mouseMove);
    canvas.removeEventListener("mousedown", mouseDown);
    canvas.removeEventListener("mouseup", endStroke);
    canvas.removeEventListener("mouseout", endStroke);
    canvas.removeEventListener("mouseenter", mouseEnter);
    canvas.removeEventListener("touchstart", touchStart);
    canvas.removeEventListener("touchend", touchEnd);
    canvas.removeEventListener("touchcancel", touchEnd);
    canvas.removeEventListener("touchmove", touchMove);
}



function updateCursorForTool(tool) {
    if (tool === "drawing") {
        updateCursor(0, 'image/scraper.png', 1.5, 2.0, 0.9, 80);
    } else if (tool === "smudge") {
        updateCursor(0, 'image/cloth.png', 1, 2, 0.5, 80);
    } else if (tool === "bubble") {
        updateCursor(0, 'image/sponge.png', 1, 2, 0.5, 80);
    } else if (tool === "brush") {
        updateCursor(0, 'image/brush.png', 1, 2, 0.5, 80); // 假设有一个brush.png的光标图像
    } else if (tool === "mop") {
        updateCursor(0, 'image/mop.png', 1, 2, 0.5, 80); // 假设有一个mop.png的光标图像
    } else if (tool === "slice") {
        updateCursor(0, 'image/slice.png', 1, 2, 0.5, 80); // 假设有一个slice.png的光标图像
    } else if (tool === "spray") { // 新增
        updateCursor(0, 'image/spray.png', 1, 2, 0.5, 80); // 假设有一个spray.png的光标图像
    }
}









// 更新鼠标指针函数
const updateCursor = (angle, src, enlarge, offsetx, offsety, brushsize) => {
    const cursorImage = new Image();
    cursorImage.src = src; // 传递的自定义鼠标图像路径

    cursorImage.onload = () => {
        const cursorCanvas = document.createElement('canvas');
        const cursorContext = cursorCanvas.getContext('2d');
        const brushSize = brushsize * enlarge;
        cursorCanvas.width = brushSize;
        cursorCanvas.height = brushSize;

        // 偏移值，可以根据需要进行调整
        const adjustedOffsetX = -brushSize / offsetx;
        const adjustedOffsetY = -brushSize * offsety;

        cursorContext.translate(brushSize / 2, brushSize / 2);
        cursorContext.rotate(angle);
        cursorContext.drawImage(cursorImage, adjustedOffsetX, adjustedOffsetY, brushSize, brushSize);

        const cursorDataURL = cursorCanvas.toDataURL('image/png');
        canvas.style.cursor = `url(${cursorDataURL}) ${brushSize / 2} ${brushSize / 2}, auto`;
    };
};

function initializeDrawingTool() {
    const colour = "#a4c3e7";
    const strokeWidth = 80;
    const varyBrightness = 8;
    let latestPoint;
    let drawing = false;
    let currentAngle;

    const varyColour = sourceColour => {
        const amount = Math.round(Math.random() * 2 * varyBrightness);
        const c = tinycolor(sourceColour);
        const varied =
            amount > varyBrightness
                ? c.brighten(amount - varyBrightness)
                : c.darken(amount);
        return varied.toHexString();
    };

    const makeBrush = size => {
        const brush = [];
        let bristleCount = Math.round(size / 3);
        const gap = strokeWidth / bristleCount;
        for (let i = 0; i < bristleCount; i++) {
            const distance =
                i === 0 ? 0 : gap * i + (Math.random() * gap) / 2 - gap / 2;
            brush.push({
                distance,
                thickness: Math.random() * 2 + 2,
                colour: varyColour(colour)
            });
        }
        return brush;
    };

    let currentBrush = makeBrush(strokeWidth);

    const rotatePoint = (distance, angle, origin) => [
        origin[0] + distance * Math.cos(angle),
        origin[1] + distance * Math.sin(angle)
    ];

    const getBearing = (origin, destination) =>
        (Math.atan2(destination[1] - origin[1], destination[0] - origin[0]) -
            Math.PI / 2) %
        (Math.PI * 2);

    const getNewAngle = (origin, destination, oldAngle) => {
        const bearing = getBearing(origin, destination);
        if (typeof oldAngle === "undefined") {
            return bearing;
        }
        return oldAngle - angleDiff(oldAngle, bearing);
    };

    const angleDiff = (angleA, angleB) => {
        const twoPi = Math.PI * 2;
        const diff =
            ((angleA - (angleB > 0 ? angleB : angleB + twoPi) + Math.PI) % twoPi) -
            Math.PI;
        return diff < -Math.PI ? diff + twoPi : diff;
    };

    const strokeBristle = (origin, destination, bristle, controlPoint) => {
        context.beginPath();
        context.moveTo(origin[0], origin[1]);
        context.strokeStyle = bristle.colour;
        context.lineWidth = bristle.thickness;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.shadowColor = bristle.colour;
        context.shadowBlur = bristle.thickness / 2;
        context.quadraticCurveTo(
            controlPoint[0],
            controlPoint[1],
            destination[0],
            destination[1]
        );
        context.stroke();
    };

    const drawStroke = (bristles, origin, destination, oldAngle, newAngle) => {
        bristles.forEach(bristle => {
            context.beginPath();
            const bristleOrigin = rotatePoint(
                bristle.distance - strokeWidth / 2,
                oldAngle,
                origin
            );

            const bristleDestination = rotatePoint(
                bristle.distance - strokeWidth / 2,
                newAngle,
                destination
            );
            const controlPoint = rotatePoint(
                bristle.distance - strokeWidth / 2,
                newAngle,
                origin
            );

            strokeBristle(bristleOrigin, bristleDestination, bristle, controlPoint);
        });
    };

    const continueStroke = newPoint => {
        if (!isDrawingToolEnabled) return;
        const newAngle = getNewAngle(latestPoint, newPoint, currentAngle);
        drawStroke(currentBrush, latestPoint, newPoint, currentAngle, newAngle);
        currentAngle = newAngle % (Math.PI * 2);
        latestPoint = newPoint;
        updateCursor(newAngle);
    };

    const startStroke = point => {
        if (!isDrawingToolEnabled) return;
        currentAngle = undefined;

        currentBrush = makeBrush(strokeWidth);
        drawing = true;
        latestPoint = point;
    };

    const getTouchPoint = evt => {
        if (!evt.currentTarget) {
            return [0, 0];
        }
        const rect = evt.currentTarget.getBoundingClientRect();
        const touch = evt.targetTouches[0];
        return [touch.clientX - rect.left, touch.clientY - rect.top];
    };

    const BUTTON = 0b01;
    const mouseButtonIsDown = buttons => (BUTTON & buttons) === BUTTON;

    const mouseMove = evt => {
        if (!drawing || !isDrawingToolEnabled) {
            return;
        }
        continueStroke([evt.offsetX, evt.offsetY]);
    };

    const mouseDown = evt => {
        if (drawing || !isDrawingToolEnabled) {
            return;
        }
        evt.preventDefault();
        canvas.addEventListener("mousemove", mouseMove, false);
        startStroke([evt.offsetX, evt.offsetY]);
    };

    const mouseEnter = evt => {
        if (!mouseButtonIsDown(evt.buttons) || drawing || !isDrawingToolEnabled) {
            return;
        }
        mouseDown(evt);
    };

    const endStroke = evt => {
        if (!drawing) {
            return;
        }
        drawing = false;
        evt.currentTarget.removeEventListener("mousemove", mouseMove, false);
    };

    const touchStart = evt => {
        if (drawing || !isDrawingToolEnabled) {
            return;
        }
        evt.preventDefault();
        startStroke(getTouchPoint(evt));
    };

    const touchMove = evt => {
        if (!drawing || !isDrawingToolEnabled) {
            return;
        }
        continueStroke(getTouchPoint(evt));
    };

    const touchEnd = evt => {
        drawing = false;
    };

    canvas.addEventListener("touchstart", touchStart, false);
    canvas.addEventListener("touchend", touchEnd, false);
    canvas.addEventListener("touchcancel", touchEnd, false);
    canvas.addEventListener("touchmove", touchMove, false);

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", endStroke, false);
    canvas.addEventListener("mouseout", endStroke, false);
    canvas.addEventListener("mouseenter", mouseEnter, false);

    const cursorImage = new Image();
    cursorImage.src = 'image/scraper.png';
    const updateCursor = (angle) => {
        const cursorCanvas = document.createElement('canvas');
        const cursorContext = cursorCanvas.getContext('2d');
        const brushSize = strokeWidth * 1.5;
        cursorCanvas.width = brushSize;
        cursorCanvas.height = brushSize;

        const offsetX = -brushSize / 2.0;
        const offsetY = -brushSize * 0.9;

        cursorContext.translate(brushSize / 2, brushSize / 2);
        cursorContext.rotate(angle);
        cursorContext.drawImage(cursorImage, offsetX, offsetY, brushSize, brushSize);

        const cursorDataURL = cursorCanvas.toDataURL('image/png');
        canvas.style.cursor = `url(${cursorDataURL}) ${brushSize / 2} ${brushSize / 2}, auto`;
    };

    return {
        mouseMove,
        mouseDown,
        endStroke,
        mouseEnter,
        touchStart,
        touchMove,
        touchEnd
    };
}



function initializeSmudgeTool() {
    updateCursor(0, 'image/cloth.png', 1, 2, 0.5, 80);
    //const context = canvas.getContext("2d");
    const bs = 64; // 笔刷大小
    const bsh = bs / 2; // 笔刷大小的一半
    const smudgeAmount = 0.25; // 模糊效果的强度

    var mouse = { x: 0, y: 0, button: false };

    function getCanvasRelativePosition(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function mouseEvents(e) {
        const pos = getCanvasRelativePosition(e);
        mouse.x = pos.x;
        mouse.y = pos.y;
        mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
    }

    ["mousedown", "mouseup", "mousemove"].forEach(function (name) {
        document.addEventListener(name, mouseEvents);
    });

    var grad = context.createRadialGradient(bsh, bsh, 0, bsh, bsh, bsh);
    grad.addColorStop(0, "black");
    grad.addColorStop(1, "rgba(0,0,0,0)");

    var v_brush = createCanvas(bs);
    v_brush.ctx.imageSmoothingEnabled = false;

    function createCanvas(w, h = w) {
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.ctx = c.getContext("2d");
        return c;
    }

    function brushFrom(tmp_ctx, x, y) {
        v_brush.ctx.globalCompositeOperation = "source-over";
        v_brush.ctx.globalAlpha = 1;
        v_brush.ctx.drawImage(tmp_ctx.canvas, -(x - bsh), -(y - bsh));
        v_brush.ctx.globalCompositeOperation = "destination-in";
        v_brush.ctx.globalAlpha = 1;
        v_brush.ctx.fillStyle = grad;
        v_brush.ctx.fillRect(0, 0, bs, bs);
    }

    var tmp_canvas = createCanvas(canvas.width, canvas.height);
    var tmp_ctx = tmp_canvas.ctx;
    tmp_ctx.drawImage(canvas, 0, 0);

    var lastX;
    var lastY;

    function update(timer) {
        if (isSmudgeToolEnabled) {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.globalAlpha = 1;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(tmp_canvas, 0, 0);

            if (mouse.button) {
                v_brush.ctx.globalAlpha = smudgeAmount;
                var dx = mouse.x - lastX;
                var dy = mouse.y - lastY;
                var dist = Math.sqrt(dx * dx + dy * dy);
                for (var i = 0; i < dist; i += 1) {
                    var ni = i / dist;
                    brushFrom(tmp_ctx, lastX + dx * ni, lastY + dy * ni);
                    ni = (i + 1) / dist;
                    tmp_ctx.drawImage(v_brush, lastX + dx * ni - bsh, lastY + dy * ni - bsh);
                }
            } else {
                v_brush.ctx.clearRect(0, 0, bs, bs);
            }

            lastX = mouse.x;
            lastY = mouse.y;
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

    return {
        mouseMove: update, // Use the same function for update
        mouseDown: mouseEvents,
        endStroke: mouseEvents,
        mouseEnter: mouseEvents
    };
}

function bubble() {
    updateCursor(0, 'image/sponge.png', 1, 2, 0.5, 80);
    const particleArray = [];
    let isDrawing = false; // Flag to check if the mouse is pressed
    const bubbleCanvas = document.createElement('canvas');
    bubbleCanvas.width = canvas.width;
    bubbleCanvas.height = canvas.height;
    bubbleCanvas.style.position = "absolute";
    bubbleCanvas.style.top = canvas.getBoundingClientRect().top + "px";
    bubbleCanvas.style.left = canvas.getBoundingClientRect().left + "px";
    bubbleCanvas.style.pointerEvents = "none";
    bubbleCanvas.style.zIndex='1';
    bubbleCanvas.id = "bubbleCanvas"; // 设置ID方便后续移除
    document.body.appendChild(bubbleCanvas);
    const bubbleContext = bubbleCanvas.getContext('2d', { willReadFrequently: true });

    const initialCanvasState = context.getImageData(0, 0, canvas.width, canvas.height);

    class Particle {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.radius = Math.random() * 20;
            this.dx = Math.random() * 7;
            this.dy = Math.random() * 7;
            this.hue = 200;
            this.maxDistance = Math.random() * 200; // 设置随机的最大移动距离
            this.startX = x;
            this.startY = y;
            this.moving = true;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = `hsl(${this.hue} 100% 50%)`;
            ctx.stroke();

            const gradient = ctx.createRadialGradient(
                this.x,
                this.y,
                1,
                this.x + 0.5,
                this.y + 0.5,
                this.radius
            );

            gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.3)");
            gradient.addColorStop(0.95, "#e7feff");

            ctx.fillStyle = gradient;
            ctx.fill();
        }

        move() {
            if (!this.moving) return;

            this.x += this.dx;
            this.y += this.dy;

            const distance = Math.sqrt((this.x - this.startX) ** 2 + (this.y - this.startY) ** 2);
            if (distance >= this.maxDistance) {
                this.stop();
            }
        }

        stop() {
            this.moving = false;
        }
    }

    const getCanvasRelativePosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const handleDrawCircle = (event) => {
        const pos = getCanvasRelativePosition(event);
        const a = pos.x;
        const b = pos.y;

        for (let i = 0; i < 5; i++) {
            const particle = new Particle(a, b);
            particleArray.push(particle);
        }
    };

    const animate = () => {
        if (!isBubbleToolEnabled) {
            return; // 停止动画
        }

        // 清除 bubbleCanvas
        bubbleContext.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

        particleArray.forEach((particle) => {
            particle?.move();
            particle?.draw(bubbleContext);
        });

        // 清除并重绘 canvas
        context.putImageData(initialCanvasState, 0, 0); // 恢复初始状态
        context.drawImage(bubbleCanvas, 0, 0); // 绘制泡泡画布

        requestAnimationFrame(animate);
    };

    animate();

    const mouseDown = (event) => {
        isDrawing = true;
        handleDrawCircle(event);
    };

    const mouseMove = (event) => {
        if (isDrawing) {
            handleDrawCircle(event);
        }
    };

    const endStroke = () => {
        isDrawing = false;
    };

    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseup", endStroke);

    return {
        mouseMove,
        mouseDown,
        endStroke,
        mouseEnter: () => {}
    };
}

function strokeBrush() {
    updateCursor(0, 'image/too4.png', 1, 2, 0.5, 80);

    var img = new Image();
    img.src = 'image/strokebrush.png';
    img.width = 10;

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    function angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    context.lineJoin = context.lineCap = 'round';

    var isDrawing = false;
    var lastPoint = null;

    function mouseDown(e) {
        if (!isBrushToolEnabled) return; // 新增
        isDrawing = true;
        lastPoint = getMousePos(canvas, e);
    }

    function mouseMove(e) {
        if (!isDrawing || !isBrushToolEnabled) return; // 新增

        var currentPoint = getMousePos(canvas, e);
        var dist = distanceBetween(lastPoint, currentPoint);
        var angle = angleBetween(lastPoint, currentPoint);

        for (var i = 0; i < dist; i++) {
            var x = lastPoint.x + (Math.sin(angle) * i);
            var y = lastPoint.y + (Math.cos(angle) * i);
            context.save();
            context.translate(x, y);
            context.scale(0.3, 0.3);
            context.rotate(Math.PI * 180 / getRandomInt(0, 180));
            context.drawImage(img, 0, 0);
            context.restore();
        }

        lastPoint = currentPoint;
    }

    function endStroke() {
        isDrawing = false;
    }

    return {
        mouseMove,
        mouseDown,
        endStroke,
        mouseEnter: endStroke,
        touchStart: mouseDown,
        touchMove: mouseMove,
        touchEnd: endStroke
    };
}



function mopbrush() {
    context.lineWidth = 60;
    context.lineJoin = context.lineCap = 'butt';
    context.strokeStyle = '#729ecd'; // 设置画笔颜色

    var isDrawing = false;
    var lastPoint = null;

    function mouseDown(e) {
        if (!isMopBrushEnabled) return; // 检查工具是否启用
        isDrawing = true;
        lastPoint = getMousePos(canvas, e);
    }

    function mouseMove(e) {
        if (!isDrawing || !isMopBrushEnabled) return; // 检查工具是否启用

        var currentPoint = getMousePos(canvas, e);
        
        context.beginPath();
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(currentPoint.x, currentPoint.y);
        context.stroke();

        context.beginPath(); // 每条线段都需要重新开始路径
        context.moveTo(lastPoint.x - 5, lastPoint.y - 5);
        context.lineTo(currentPoint.x - 5, currentPoint.y - 5);
        context.stroke();

        lastPoint = currentPoint;
    }

    function endStroke() {
        isDrawing = false;
    }

    return {
        mouseMove,
        mouseDown,
        endStroke,
        mouseEnter: endStroke,
        touchStart: mouseDown,
        touchMove: mouseMove,
        touchEnd: endStroke
    };
}

function sliceStroke(offset) {
    updateCursor(0, 'image/slice.png', 1, 2, 0.5, 80);

    context.lineWidth = 5;
    context.lineJoin = context.lineCap = 'round';
    context.strokeStyle = '#4eb2f9'; // 设置画笔颜色

    var isDrawing = false;
    var lastPoint = null;

    function mouseDown(e) {
        if (!isSliceStrokeEnabled) return; // 检查工具是否启用
        isDrawing = true;
        lastPoint = getMousePos(canvas, e);
    }

    function mouseMove(e) {
        if (!isDrawing || !isSliceStrokeEnabled) return; // 检查工具是否启用

        var currentPoint = getMousePos(canvas, e);

        context.beginPath();
        context.globalAlpha = 1;
        context.moveTo(lastPoint.x - 4 * offset, lastPoint.y - 4 * offset);
        context.lineTo(currentPoint.x - 4 * offset, currentPoint.y - 4 * offset);
        context.stroke();
        
        context.globalAlpha = 0.6;
        context.beginPath();
        context.moveTo(lastPoint.x - 2 * offset, lastPoint.y - 2 * offset);
        context.lineTo(currentPoint.x - 2 * offset, currentPoint.y - 2 * offset);
        context.stroke();
        
        context.globalAlpha = 0.4;
        context.beginPath();
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(currentPoint.x, currentPoint.y);
        context.stroke();
        
        context.globalAlpha = 0.3;
        context.beginPath();
        context.moveTo(lastPoint.x + 2 * offset, lastPoint.y + 2 * offset);
        context.lineTo(currentPoint.x + 2 * offset, currentPoint.y + 2 * offset);
        context.stroke();
        
        context.globalAlpha = 0.2;
        context.beginPath();
        context.moveTo(lastPoint.x + 4 * offset, lastPoint.y + 4 * offset);
        context.lineTo(currentPoint.x + 4 * offset, currentPoint.y + 4 * offset);
        context.stroke();
        
        lastPoint = currentPoint;
    }

    function endStroke() {
        isDrawing = false;
    }

    return {
        mouseMove,
        mouseDown,
        endStroke,
        mouseEnter: endStroke,
        touchStart: mouseDown,
        touchMove: mouseMove,
        touchEnd: endStroke
    };
}

function spray() {
    var clientX, clientY, timeout;
    var density = 20;
    var isDrawing = false;

    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function mouseDown(e) {
        if (!isSprayToolEnabled) return; // 检查工具是否启用
        isDrawing = true;
        context.lineJoin = context.lineCap = 'round';
        context.fillStyle = "#ffffff";
        const pos = getMousePos(canvas, e);
        clientX = pos.x;
        clientY = pos.y;

        timeout = setTimeout(function draw() {
            if (!isDrawing) return; // 仅在 isDrawing 为 true 时绘制
            for (var i = density; i--; ) {
                var angle = getRandomFloat(0, Math.PI * 2);
                var radius = getRandomFloat(0, 20);
                context.fillRect(
                    clientX + radius * Math.cos(angle),
                    clientY + radius * Math.sin(angle), 
                    2, 2
                );
            }
            if (!timeout) return;
            timeout = setTimeout(draw, 50);
        }, 50);
    }

    function mouseMove(e) {
        if (!isDrawing || !isSprayToolEnabled) return; // 检查工具是否启用
        const pos = getMousePos(canvas, e);
        clientX = pos.x;
        clientY = pos.y;
    }

    function mouseUp() {
        isDrawing = false;
        clearTimeout(timeout);
        timeout = null;
    }

    return {
        mouseMove,
        mouseDown,
        mouseUp,
        mouseEnter: mouseUp,
        touchStart: mouseDown,
        touchMove: mouseMove,
        touchEnd: mouseUp
    };
}












function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}



