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

  function minus (a,b) {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    };
  }

  function normalized (a) {
    var s = size(a);
    return { x: a.x / s, y: a.y / s };
  }

  function multiply (scalar,a) {
    return { x: a.x * scalar, y: a.y * scalar };
  }


function   draw_circle(x,y,r,color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x,y,r,0.0, 2 * Math.PI);
  ctx.shadowColor = 'none';
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
    // var color = Math.floor(Math.random()*16777215).toString(16);

    var C = 2.7;
    var x = 50 + ball[0] / C;
    var y = 50 + ball[1] / C;
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
  add_balls (GREY_BALLS, 'grey');
  balls[1].v.x = 1.5;

  // balls.push( new Ball({ x: center.x - 60.0, y:center.y - 60, vx: -3.127,  vy: 0.2, r: 10.0, color: 'red' }));
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
    var delta = ball.r + d - this.r;

    if (delta > 0) {
      var old_size = size(ball.v);

      // normalize the normal vector
      var di = multiply (-1.0, normalized(ball.v)) ;
      var dn = normalized ({  x: -(ball.x - center.x), y: -(ball.y - center.y)  });

      var ds = minus(multiply(2*dot(dn,di), dn), di);

      ball.v = multiply(old_size, normalized(ds));
      ball.update();
    }
  }


  step = function() {
    if (true) {
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

}


