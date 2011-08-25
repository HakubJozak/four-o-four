function   draw_circle(x,y,r,color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x,y,r,0.0, 2 * Math.PI);
  ctx.fill();
}

Ball = function (opts) {
  this.x = opts.x;
  this.y = opts.y;
  this.vx = opts.vx;
  this.vy = opts.vy;
  this.r = opts.r;
  this.m = opts.r * 10;
  this.color = opts.color;
}

Ball.prototype.draw = function() {
  draw_circle(this.x, this.y, this.r, this.color);
}

Ball.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
}

Ball.prototype.update = function(other) {
  var dx = this.x - other.x;
  var dy = this.y - other.y;
  var R = this.r + other.r;
}

Ball.prototype.dist2 = function(other) {
  var dx = this.x - other.x;
  var dy= this.y - other.y;
  return  dx*dx  + dy*dy;
}

Ball.prototype.dist = function(other) {
  return Math.sqrt( this.dist2());
}



Ball.prototype.v = function(other) {
  return Math.sqrt(vx*vx + vy*vy);
}


// http://www.allcrunchy.com/Web_Stuff/Particle_Simulation_Toolkit/pst.js
Ball.prototype.collide = function(other) {
  var d = this.dist(other);
  var overlap = this.radius + other.radius - dist;

  if (overlap > 0){
    velocity = function(a,b) {
      return (a.v() * (a.m - b.m + 2 * b.v() * b.m) / (a.m + b.m);
    }

    var v1 = velocity(this,other);
    var v2 = velocity(other,this);
    var unit = { x: (other.x - this.x)/d, y: (other.y - this.y)/d }
    var move = d / 2;

    this.vx = -unit.x * s1;
    this.vy = -unit.y * s1;
    this.x = -unit.x * move;
    this.y = -unit.y * move;

    other.vx = unit.x * s2;
    other.vy = unit.y * s2;
    other.x = unit.x * move;
    other.y = unit.y * move;
  }
}


window.onload = function () {
  var canvas = window.document.getElementById('erm');
  ctx = canvas.getContext('2d');

  balls = new Array();
  balls.push( new Ball({ x: 20,  y:20, vx: 1,  vy: 0, r: 25, color: 'red' }));
  balls.push( new Ball({ x: 120, y:20, vx: -1, vy: 0, r: 15, color: 'green' }));

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
    for (i = 0; i < balls.length; i++) {
      balls[i].update();
    }


    for (i = 0; i < balls.length; i++) {
      for (j = 0; j < balls.length; j++) {
        balls[i].collide(balls[j]);
      }
    }

    for (i = 0; i < balls.length; i++) {
      balls[i].draw();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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


