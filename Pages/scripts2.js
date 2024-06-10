        var startingText = `
        Kawaii Strawberry Hearts Bowl Cute Ceramic Noodle Fruit Breakfast Salad Rice Dessert Decorative Bowl Korean Kitchen Tableware
        `
        var separateLines = startingText.match(/[^\r\n]+/g);
        var blockTextHTML = '';
        for(var i = 0; i< separateLines.length; i++){
            var splitText = separateLines[i].split(' ');
            for(var j=0; j<splitText.length; j++){
                blockTextHTML = blockTextHTML + '<span>' + splitText[j] +  ' </span>'
            }
            blockTextHTML = blockTextHTML + '<br>'
 
        }
 
        blockText.innerHTML = blockTextHTML;
        



        //鼠标移动

        var cursorpic = document.getElementById('sponge');




//点击改变颜色、字体
 var spans = document.querySelectorAll('span');

 spans.forEach(function(span){
    span.addEventListener('click',function(){
        span.style.color = bottlecolor;
        span.style.fontFamily = 'tiny280';
        span.style.fontSize = '15pt';
        span.style.filter = 'blur(1px)';
    })
 })

 //点击选择颜色

 var bottlecolor = '#ff3be3'

 var bottles = document.querySelectorAll('.decro,.bottle');
console.log(bottles);
 bottles.forEach(function(bottle){
    bottle.addEventListener('click',function(){
        bottlecolor = bottle.getAttribute('data-color');
        console.log(bottlecolor);
    })

    
 })

    var container1 = document.getElementById("container");
    // let brushSize = 50; // 画笔大小
    let currentBrush; // 当前使用的画笔图片

    let shapeSize;

    function preload() {
            // 预加载源图片
            sourceImg = loadImage('../image/product/9_4.jpg');
            brush1 = loadImage('../image/brush/bru1.png');
            brush2 = loadImage('../image/brush/brush2.png');
            brush3 = loadImage('../image/brush/brush3.png');
            brush4 = loadImage('../image/brush/brush4.png');
            brush5 = loadImage('../image/brush/brush5.png');
            brush6 = loadImage('../image/brush/brush6.png');
            brush7 = loadImage('../image/brush/brush7.png');
            brush8 = loadImage('../image/brush/brush8.png');
            brush9 = loadImage('../image/brush/brush9.png');
            brush10 = loadImage('../image/brush/brush10.png');
            brush11 = loadImage('../image/brush/brush11.png');

            brush12 = loadImage('../image/brush/brush12.png');
            brush13 = loadImage('../image/brush/brush13.png');
            brush14 = loadImage('../image/brush/brush14.png');
            brush15 = loadImage('../image/brush/brush15.png');
            brush16 = loadImage('../image/brush/brush16.png');
            brush17 = loadImage('../image/brush/brush17.png');
            brush18 = loadImage('../image/brush/brush18.png');
            brush19 = loadImage('../image/brush/brush19.png');
            brush20 = loadImage('../image/brush/brush20.png');
            brush21 = loadImage('../image/brush/brush21.png');
    }

    function setup() {
        // 创建画布
        let canvas = createCanvas(650, 650);
        canvas.parent('canvas-container');
            
        image(sourceImg, 0, 0, width, height);
        // 设置默认使用的画笔
        currentBrush = brush1;
        shapeSize = 30;
    }


        



        let shapeType = 'ellipse'; // 初始绘制的形状类型，默认为椭圆
      
        function draw() {
            // 绘制形状
            // if (mouseIsPressed) {
            //     if (shapeType === 'ellipse') {
            //         fill(255, 241, 198); // 红色
            //         ellipse(mouseX, mouseY, shapeSize, shapeSize); // 绘制椭圆
            //     } else if (shapeType === 'rect') {
            //         fill(0, 0, 255); // 蓝色
            //         rectMode(CENTER);
            //         rect(mouseX, mouseY, shapeSize, shapeSize); // 绘制矩形
            //     }
            // }
            if (mouseIsPressed) {
            if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
                // 在鼠标位置绘制当前画笔图片
                image(currentBrush, mouseX - shapeSize / 2, mouseY - shapeSize / 2, shapeSize, shapeSize);
            }
            }
        }

        // 鼠标点击事件，切换形状类型
        // function mouseClicked() {
        //     if (shapeType === 'ellipse') {
        //         shapeType = 'rect'; // 切换到矩形
        //     } else if (shapeType === 'rect') {
        //         shapeType = 'ellipse'; // 切换到椭圆
        //     }
        // }

        // 点击画笔图片时切换画笔
        // 假设你的 brush 元素的 id 分别为 brush1 到 brush11
for (let i = 1; i <= 21; i++) {
    document.getElementById('brush' + i).addEventListener('click', function() {
        currentBrush = window['brush' + i];
    });
}


// 获取元素
const size1 = document.getElementById('size1');
const size2 = document.getElementById('size2');
const size4 = document.getElementById('size4');
const size5 = document.getElementById('size5');

// 为每个元素添加点击事件监听器
size1.addEventListener('click', function() {
    shapeSize = 10;
});

size2.addEventListener('click', function() {
    shapeSize = 30;
});

size4.addEventListener('click', function() {
    shapeSize = 45;
});

size5.addEventListener('click', function() {
    shapeSize = 60;
});

// 获取元素
const tower = document.getElementById('tower');

// 添加点击事件监听器
tower.addEventListener('click', function() {
    clear(); // 调用清空画布函数
    image(sourceImg, 0, 0, width, height);
});

document.getElementById('submitbutton').addEventListener('click', function() {
    saveCanvas('myCanvas', 'png');
});




       
        