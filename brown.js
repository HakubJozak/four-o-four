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
  this.m = opts.r * 100;
  this.color = opts.color;
}

Ball.prototype.draw = function() {
  draw_circle(this.x, this.y, this.r, this.color);
}

Ball.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
}


Ball.prototype.dist2 = function(other) {
  var dx = this.x - other.x;
  var dy= this.y - other.y;
  return  dx*dx + dy*dy;
}

Ball.prototype.dist = function(other) {
  return Math.sqrt( this.dist2(other));
}

Ball.prototype.v = function(other) {
  return Math.sqrt(this.vx*this.vx + this.vy*this.vy);
}


// http://www.allcrunchy.com/Web_Stuff/Particle_Simulation_Toolkit/pst.js
Ball.prototype.collide = function(other) {
  var d = this.dist(other);
  var overlap = this.r + other.r - d;

  if (overlap > 0){
    velocity = function(a,b) {
      return (a.v() * (a.m - b.m) + 2 * b.v() * b.m) / (a.m + b.m);
    }

    var v1 = velocity(this,other);
    var v2 = velocity(other,this);

    var unit = { x: (other.x - this.x)/d, y: (other.y - this.y)/d }

    this.vx = -unit.x * v1;
    this.vy = -unit.y * v1;
    other.vx = unit.x * v2;
    other.vy = unit.y * v2;

    /*
    var move = 0;
    this.x  -= unit.x * move;
    this.y  -= unit.y * move;
    other.x += unit.x * move;
    other.y += unit.y * move;
    */
  }
}


window.onload = function () {
  var canvas = window.document.getElementById('erm');
  ctx = canvas.getContext('2d');

  center = { x: canvas.width/2  - 1,
             y: canvas.height/2 - 1 }

  balls = new Array();
  balls.push( new Ball({ x: center.x - 40.0, y:center.y, vx: 0.5127,  vy: 0.0, r: 35.0, color: 'red' }));
  balls.push( new Ball({ x: center.x + 40.0, y:center.y, vx: -0.5, vy: 0.0, r: 15.0, color: 'green' }));
  balls.push( new Ball({ x: center.x, y:center.y + 20, vx: -0.5, vy: 0.0, r: 15.0, color: 'green' }));

  wall = { r: 160 }

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

  wall.collide = function(ball) {
    var d = ball.dist(center)

      if (ball.r + d > this.r) {
        ball.vx = -ball.vx;
        ball.vy = -ball.vy;
      }
  }


  step = function() {
    for (var i = 0; i < balls.length; i++) {
      balls[i].update();
    }

    for (var i = 0; i < balls.length; i++) {
      for (var j = 0; j < balls.length; j++) {
        if (i != j) {
          balls[i].collide(balls[j]);
        }
      }

      wall.collide(balls[i]);
    }

    // draw all
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wall.draw();
    for (var i = 0; i < balls.length; i++) { balls[i].draw(); }

    window.setTimeout(step, 10);
  }

  step();


//  draw_circle(20,20,10, '#FF8112');
//  draw_circle(10,20,5, '#4E4B4A');
}


