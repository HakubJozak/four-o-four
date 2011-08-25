


function   draw_circle(x,y,r,color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x,y,r,0.0, 2 * Math.PI);
  ctx.fill();
}

Particle = function (opts) {
  this.x = opts.x;
  this.y = opts.y;
  this.vx = opts.vx;
  this.vy = opts.vy;
  this.r = opts.r;
  this.color = opts.color;
}

Particle.prototype.draw = function() {
  draw_circle(this.x, this.y, this.r, this.color);
}

Particle.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
}


a = new Particle({ x: 20, y:20, vx: 1, vy: 0, r: 25, color: 'red' });
b = new Particle({ x: 120, y:20, vx: -1, vy: 0, r: 15, color: 'green' });

window.onload = function () {
  var canvas = window.document.getElementById('erm');
  ctx = canvas.getContext('2d');


  // background
  center = { x: canvas.width/2  - 1,
             y: canvas.height/2 - 1 }

  wall = { r: 10 }

  wall.draw = function() {
    ctx.beginPath();
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowColor = 'gray';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.arc(center.x, center.y, wall.r,0.0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }



  step = function() {
    a.update();
    b.update();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    a.draw();
    b.draw();
    window.setTimeout(step, 10);
  }

  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowColor = 'gray';
  wall.draw();
  step();


//  draw_circle(20,20,10, '#FF8112');
//  draw_circle(10,20,5, '#4E4B4A');
}


