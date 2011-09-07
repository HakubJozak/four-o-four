  function perp (a) {
    return {
      x: -(a.vy + 1.0) / a.vx,
      y: 1.0
    }
  }

  function dot (a,b) {
    return (a.x * b.x) + (a.y  * b.y);
  }

  function size (a) {
    return Math.sqrt((a.x * a.x) + (a.y * a.y));
  }

  function normalized (a) {
    var s = size(a);
    return { x: a.x / s, y: a.y / s };
  }

function   draw_circle(x,y,r,color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x,y,r,0.0, 2 * Math.PI);
  ctx.fill();
}

Ball = function (opts) {
  this.x = opts.x;
  this.y = opts.y;
  this.v = { x: opts.vx, y: opts.vy },
  this.r = opts.r;
  this.m = 2 * Math.PI * opts.r * opts.r;
  this.color = opts.color;
}

Ball.prototype.draw = function() {
  draw_circle(this.x, this.y, this.r, this.color);
}

Ball.prototype.update = function() {
  this.x += this.v.x;
  this.y += this.v.y;
}


Ball.prototype.dist2 = function(other) {
  var dx = this.x - other.x;
  var dy= this.y - other.y;
  return  dx*dx + dy*dy;
}

Ball.prototype.dist = function(other) {
  return Math.sqrt( this.dist2(other));
}



Ball.prototype.collide = function(other) {
  var d = this.dist(other);
  var overlap = this.r + other.r - d;

  if (overlap > 0){
    velocity = function(a,b) {
      var c = (size(a.v) * (a.m - b.m)) - (2 * size(b.v) * b.m);
      return Math.abs(c) / (a.m + b.m);
    }

    var unit = { x: (other.x - this.x)/d, y: (other.y - this.y)/d }

    var v1 = velocity(this, other);
    var v2 = velocity(other, this);

    this.v.x = -unit.x * v1;
    this.v.y = -unit.y * v1;
    other.v.x = unit.x * v2;
    other.v.y = unit.y * v2;

    this.update();
    other.update();
  }
}

function add_balls(coords, color) {
 for (var i = 0; i < coords.length; i++) {
    var ball = coords[i];

     console.info(i);

    var C = 3.0;
    var x = ball[0] / C;
    var y = ball[1] / C;
    var r = ball[2] / C;

    balls.push( new Ball({ x: x, y: y, vx: 0.0, vy: 0.0, r: r, color: color }));
  }
}



window.onload = function () {
  var canvas = window.document.getElementById('erm');
  ctx = canvas.getContext('2d');

  center = { x: canvas.width/2  - 1,
             y: canvas.height/2 - 1 }

  balls = new Array();
    add_balls(ORANGE_BALLS, 'orange');
    add_balls(GREY_BALLS, 'grey');

  // balls.push( new Ball({ x: center.x - 60.0, y:center.y, vx: -0.5127,  vy: 0.2, r: 35.0, color: 'red' }));
  // balls.push( new Ball({ x: center.x - 40.0, y:center.y, vx:  0.5,  vy: 0.0, r: 30.0, color: 'red' }));
  // balls.push( new Ball({ x: center.x + 40.0, y:center.y, vx: -0.5, vy: 0.0, r: 15.0, color: 'green' }));
  // balls.push( new Ball({ x: center.x, y:center.y + 20, vx: -0.5, vy: 0.0, r: 30.0, color: 'orange' }));




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
    var d = ball.dist(center);


    if (ball.r + d > this.r) {
      var a = {  x: (ball.x - center.x), y: (ball.y - center.y)  };
      var b = ball.v;

      // normalize the axis (vector perpendicular to wall)
      a = normalized(a);

      var alpha = Math.acos(dot(a,b) / size(b));
      var beta = Math.PI - 2*alpha;

      // rotate by beta
      ball.v.x = b.x * Math.cos(beta) - b.y * Math.sin(beta);
      ball.v.y = b.x * Math.sin(beta) + b.y * Math.cos(beta);

      ball.update();
    }
  }


  step = function() {
    if (step_count < 2100) {
      step_count++;
      window.setTimeout(step, 10);
    }

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
  }

  step_count = 0;
  step();


//  draw_circle(20,20,10, '#FF8112');
//  draw_circle(10,20,5, '#4E4B4A');
}


