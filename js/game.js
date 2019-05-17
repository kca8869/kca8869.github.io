var canvas=document.querySelector("#canvas");
var ctx=canvas.getContext("2d");
var canvasNext=document.querySelector("#canvasNext");
var ctxNext=canvasNext.getContext("2d");
var blockSize=25
canvasNext.height=blockSize*3;
canvasNext.width=blockSize*4;
canvas.width=blockSize*10;
var width=canvas.width;
var height=canvas.height;
var difficulty=1000
var blockSpeed=difficulty;
var grandArray=[];
var center=width/2-blockSize;
var rowWidth=width/blockSize;
var interval="";
var nextNum=random();
var gameEnd=false;
var gameOverDiv=document.querySelector(".game-over");
var score=document.querySelector(".score-number");
var lines=document.querySelector(".lines-number")
var scoreCount=0;
score.innerText=0;
lines.innerText=0;
var pause=false;
var pauseScreen=document.querySelector(".pause");

function random() {
  return Math.floor(Math.random()*7);
}

function Block(x,y,color) {
  this.x=x;
  this.y=y;
  this.color=color;
}

Block.prototype.draw=function () {
  ctx.fillStyle=this.color;
  ctx.fillRect(this.x,this.y,blockSize,blockSize);
  ctx.fill();
  ctx.lineWidth=1.5;
  ctx.strokeRect(this.x,this.y,blockSize,blockSize);
  ctx.stroke();
}

Block.prototype.drawNext = function () {
  ctxNext.fillStyle=this.color;
  ctxNext.fillRect(this.x,this.y,blockSize,blockSize);
  ctxNext.fill();
  ctxNext.lineWidth=1.5;
  ctxNext.strokeRect(this.x,this.y,blockSize,blockSize);
  ctxNext.stroke();
};

function Shape(x,y,num) {
  this.x=x;
  this.y=y;
  this.num=num;
  this.array=[];
  this.rotated=0;
  switch (num) {
    //line
    case 0:
      for (var i = 0; i < 4; i++) {
        var box=new Block(this.x+(i*blockSize),this.y+blockSize ,"yellow")
        this.array.push(box);
      }
      break;
      //square
    case 1:
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        var box=new Block((i*blockSize)+this.x,j*blockSize,"blue")
        this.array.push(box);
        }
      }
      break;
      //reverse L
    case 2:
    for (var i = 0; i < 4; i++) {
      if (i==3) {
        var box=new Block(this.x+((i-1)*blockSize),this.y+blockSize,"red")
      }else{
        var box=new Block(this.x+(i*blockSize),this.y,"red")
      }
      this.array.push(box);
    }
      break;
      //regular L
    case 3:
    for (var i = 0; i < 4; i++) {
      if (i==3) {
        var box=new Block(this.x+((i-1)*blockSize),this.y,"purple")
      }else{
        var box=new Block(this.x+(i*blockSize),this.y+blockSize,"purple")
      }
      this.array.push(box);
    }
      break;
      //regular Z
    case 4:
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        if (j<1) {
          var box=new Block((i*blockSize)+this.x+blockSize,j*blockSize,"orange")
        }else{
          var box=new Block((i*blockSize)+this.x,j*blockSize,"orange")
        }
        this.array.push(box);
        }
      }
      break;
      //reverse Z
    case 5:
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        if (j>0) {
          var box=new Block((i*blockSize)+this.x+blockSize,j*blockSize,"cyan")
        }else{
          var box=new Block((i*blockSize)+this.x,j*blockSize,"cyan")
        }
        this.array.push(box);
        }
      }
      break;
      //triangle
      case 6:
      for (var i = 0; i < 4; i++) {
        if (i==3) {
          var box=new Block(this.x+((i-2)*blockSize),this.y,"green")
        }else{
          var box=new Block(this.x+(i*blockSize),this.y+blockSize,"green")
        }
        this.array.push(box);
      }
        break;
  }
}

Shape.prototype.rotate = function () {
    switch (this.num) {
      case 0:
          this.rotateLine();
          this.offScreen();
        break;
      case 2:
      case 3:
      case 6:
        this.rotateL();
        break;
      case 4:
      case 5:
        this.rotateZ();
        break;
    }
    this.offScreen();
  };

Shape.prototype.draw = function () {
  for (var i = 0; i < this.array.length; i++) {
    this.array[i].draw();
  }
};

Shape.prototype.drawNext = function () {
  for (var i = 0; i < this.array.length; i++) {
    this.array[i].drawNext();
  }
};

Shape.prototype.move=function (dir,speed) {
  if (dir=="x") {
    this.x+=speed;
  }
  for (var i = 0; i < this.array.length; i++) {
    this.array[i][dir]+=speed;
  }
}

Shape.prototype.touch=function () {
  for (var i = 0; i < this.array.length; i++) {
    if (this.array[i].y+blockSize==height||grandArrayTouch(this)) {
      this.transfer();
      nextShape();
      line.move("y",-blockSize);
      rowComplete();
      return true;
    }
  }
}

Shape.prototype.touchSides = function () {
  for (var i = 0; i < this.array.length; i++) {
    if (this.array[i].x===0) {
      return "left";
    }
    if (this.array[i].x+blockSize==width) {
      return "right";
    }
  }
};

Shape.prototype.offScreen=function () {
  for (var i = 0; i < this.array.length; i++) {
    if (this.array[i].x<0) {
      this.move("x",blockSize)
    }
    if (this.array[i].x+blockSize>width) {
      this.move("x",-blockSize)
    }
    for (var j = 0; j < grandArray.length; j++) {
      if (this.array[i].y==grandArray[j].y&&this.array[i].x==grandArray[j].x) {
        this.move("y",-blockSize);
      }
    }

  }
}

Shape.prototype.transfer=function () {
  for (var i = 0; i < this.array.length; i++) {
    grandArray.push(this.array[i]);
  }
}

Shape.prototype.rotateLine=function () {
  var bs=blockSize;
  if (!this.rotated) {
    bs*=1
    this.rotated=1;
  }else{
    bs*=-1
    this.rotated=0;
  }
      this.array[0].x+=(2*bs);
      this.array[0].y+=(-2*bs);
      this.array[1].x+=(bs);
      this.array[1].y+=(-1*bs);
      this.array[3].x+=(-bs);
      this.array[3].y+=(bs);
};

Shape.prototype.rotateL=function () {
      var bs=blockSize;
      if (this.rotated==1||this.rotated==3) {
        bs*=-1;
      }
      this.array[0].x+=(bs);
      this.array[0].y+=(-1*bs);
      this.array[2].x+=(-bs);
      this.array[2].y+=(bs);
      switch (this.rotated) {
        case 0:
        if (this.num==3) {
          this.array[3].y+=(2*bs);
        }else if (this.num==6) {
          this.array[3].y+=(bs);
          this.array[3].x+=(bs);
        }else{
          this.array[3].x+=(-2*bs);
        }
          break;
        case 1:
        if (this.num==3) {
          this.array[3].x+=(2*bs);
        }else if (this.num==6) {
          this.array[3].y+=(-bs);
          this.array[3].x+=(bs);
        }else{
        this.array[3].y+=(2*bs);
        }
          break;
        case 2:
        if (this.num==3) {
          this.array[3].y+=(-2*bs);
        }else if (this.num==6) {
          this.array[3].y+=(-bs);
          this.array[3].x+=(-bs);
        }else{
        this.array[3].x+=(2*bs);
        }
          break;
        case 3:
        if (this.num==3) {
          this.array[3].x+=(-2*bs);
        }else if (this.num==6) {
          this.array[3].y+=(bs);
          this.array[3].x+=(-bs);
        }else{
        this.array[3].y+=(-2*bs);
        }
        default:
      }
    this.rotated++;
    if (this.rotated>3) {
      this.rotated=0;
    }
}

Shape.prototype.rotateZ = function () {
  var bs=blockSize;
  if (!this.rotated) {
    bs*=1
    this.rotated=1;
  }else{
    bs*=-1
    this.rotated=0;
  }
  if (this.num==4) {
    this.array[1].x+=(bs);
    this.array[1].y+=(-2*bs);
    this.array[3].x+=(bs);
  }else{
    this.array[2].x+=(bs);
    this.array[0].x+=(bs);
    this.array[0].y+=(2*bs);
  }

};

function grandArrayDraw() {
  for (var i = 0; i < grandArray.length; i++) {
    grandArray[i].draw();
  }
}

function grandArrayTouch(shape) {
  for (var i = 0; i < shape.array.length; i++) {
    for (var j = 0; j < grandArray.length; j++) {
      if (shape.array[i].y+blockSize==grandArray[j].y&&shape.array[i].x==grandArray[j].x) {
        return true;
      }
    }
  }
}

function grandArraySideTouch(shape) {
  for (var i = 0; i < shape.array.length; i++) {
    for (var j = 0; j < grandArray.length; j++) {
      if (shape.array[i].x+blockSize==grandArray[j].x&&shape.array[i].y==grandArray[j].y||shape.array[i].x==grandArray[j].x+blockSize&&shape.array[i].y==grandArray[j].y) {
        return true;
      }
    }
  }
}

function rowComplete() {
  var count=0;
  var scoreMulti=0
  for (var i = 0; i < height/blockSize; i++) {
    count=0;
    for (var j = 0; j < grandArray.length; j++) {
      if (grandArray[j].y==blockSize*i) {
        if (blockSize*i==0) {
          gameOver();
        }
        count++;
      }
    }
    if (count==width/blockSize) {
      grandArray=grandArray.filter(function(value){
        return value.y!==blockSize*i;
      });
      grandArray.forEach(function (value) {
        if (value.y<blockSize*i) {
          value.y+=blockSize;
        }
      })
      scoreMulti++;
      blockSpeed-=10;
      lines.innerText++;
      scoreCount+=100;
      setSpeed();
    }
  }
  scoreCount+=(scoreMulti*scoreMulti)*10;
  score.innerText=scoreCount;
}

window.onkeydown=function (e) {
  if (e.keyCode==39&&line.touchSides()!=="right"&&!grandArraySideTouch(line)&&!pause) {
    line.move("x",blockSize);
  }
  if (e.keyCode==37&&line.touchSides()!=="left"&&!grandArraySideTouch(line)&&!pause) {
    line.move("x",-blockSize);
  }
  if (e.keyCode==38&&!pause) {
    line.rotate();
  }
  if (e.keyCode==40&&!pause) {
    fall();
  }
  if (e.keyCode==32&&!gameEnd&&!pause) {
    drop();
  }
  if (e.keyCode==80) {
    if (!pause) {
      pause=true;
      pauseScreen.style.display="block";
    }else{
      pause=false;
      pauseScreen.style.display="none";
      window.requestAnimationFrame(loop);
    }
  }
}

function nextShape() {
    line=new Shape(center,0,nextNum);
    line.draw();
    nextNum=random();
    ctxNext.clearRect(0,0,canvasNext.width,canvasNext.height);
    var next=new Shape(0,0,nextNum);
    next.drawNext();
}
nextShape();

function drop() {
  if (!line.touch()) {
    fall();
    drop();
  }else{
    line.move("y",blockSize);
  }
}

function gameOver() {
  if (!gameEnd) {
    gameEnd=true
    gameOverDiv.style.display="block";
    clearInterval(interval);
    gameOverDiv.onclick=function reset() {
      gameEnd=false;
      lines.innerText=0;
      scoreCount=0;
      score.innerText=0;
      gameOverDiv.style.display="none";
      grandArray=grandArray.filter(function (value) {
        return value!==value;
      })
      blockSpeed=difficulty;;
      window.requestAnimationFrame(loop)
      setSpeed();
    };
  }
}

function loop() {
  ctx.clearRect(0,0,width,height);
  line.draw();
  grandArrayDraw();
  if (!gameEnd&&!pause) {
   window.requestAnimationFrame(loop);
  }

}
function fall() {
  if (!pause) {
    line.touch();
    line.move("y",blockSize);
  }

}
function setSpeed() {
  clearInterval(interval);
  interval=setInterval(fall,blockSpeed);
}
setSpeed();
window.requestAnimationFrame(loop)
