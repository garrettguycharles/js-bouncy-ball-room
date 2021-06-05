import * as utils from "./utils.js";
import {Rect} from "./rect.js";
import {DrawTool} from "./draw.js";

let FPS = 60
let game_canvas = document.getElementById("game");
game_canvas.width = window.innerWidth;
game_canvas.height = window.innerHeight;

// set game width and height here, if necessary

let screen_context = game_canvas.getContext("2d");
let brush = new DrawTool(game_canvas);
let screen = new Rect(0, 0, game_canvas.width, game_canvas.height);

let gravity = 0.5;
let friction = 0.995;

let mouse_down = false;

let ball_list = [];

let num_balls = (screen.w * screen.h) / Math.pow(75, 2);

for (let i = 0; i < num_balls; i+=1) {
  let r = utils.random_range(10, 40);
  let ball = new Rect(0, 0, r, r);
  ball.mass = 4/3 * Math.PI * Math.pow(ball.radius, 3);
  ball.center = [utils.random_range(screen.left, screen.right), utils.random_range(screen.top, screen.bottom)];
  ball.xspeed = utils.random_range(-10, 10);
  ball.yspeed = utils.random_range(-10, 10);
  ball.color = "black";

  ball_list.push(ball);
}

ball_list[ball_list.length - 1].color = "red";
ball_list[ball_list.length - 2].color = "green";
ball_list[ball_list.length - 3].color = "blue";

function draw() {
  brush.clear();

  for (let i = 0; i < ball_list.length; i++) {
    brush.ellipse(ball_list[i]);
  }
}

function update() {

  for (let i = 0; i < ball_list.length; i++) {
    let ball = ball_list[i]
    ball.x += ball.xspeed;
    ball.y += ball.yspeed;
    ball.bouncerect_inner(screen);
    for (let j = 0; j < ball_list.length; j++) {
      let otherball = ball_list[j];
      if (ball != otherball) {
        if (ball.collidecircle(otherball)) {
          ball.move_outside_circle(otherball);
          ball.bounce_elastic_2d(otherball);
        }
      }
    }

    ball.xspeed *= friction;
    ball.yspeed *= friction;

    if (utils.magnitude(ball.velocity) < 0.001) {
      ball.velocity = [0, 0];
    }
    //ball.yspeed += gravity;
  }

}

function step() {
  update();
  draw();
}

game_canvas.addEventListener("mousedown", (e) => {
  mouse_down = true;
  let x = e.offsetX;
  let y = e.offsetY;
  let influence_rect = new Rect(0, 0, 500, 500);
  influence_rect.center = [x, y];
  for (let i = 0; i < ball_list.length; i++) {
    let ball = ball_list[i];
    if (ball.collidecircle(influence_rect)) {
      ball.velocity = utils.scale_coord(influence_rect.get_unit_normal(ball), influence_rect.radius * 2 / utils.distance_between(influence_rect.center, ball.center));
    }
  }
});

game_canvas.addEventListener("touchstart", (e) => {
  mouse_down = true;
  let x = e.offsetX;
  let y = e.offsetY;
  let influence_rect = new Rect(0, 0, 500, 500);
  influence_rect.center = [x, y];
  for (let i = 0; i < ball_list.length; i++) {
    let ball = ball_list[i];
    if (ball.collidecircle(influence_rect)) {
      ball.velocity = utils.scale_coord(influence_rect.get_unit_normal(ball), influence_rect.radius * 2 / utils.distance_between(influence_rect.center, ball.center));
    }
  }
});

window.addEventListener("mouseup", (e) => {
  mouse_down = false;
});

window.addEventListener("touchend", (e) => {
  mouse_down = false;
});

game_canvas.addEventListener("mousemove", (e) => {
  if (!mouse_down) {
    return;
  }

  let x = e.offsetX;
  let y = e.offsetY;
  let influence_rect = new Rect(0, 0, 500, 500);
  influence_rect.center = [x, y];
  for (let i = 0; i < ball_list.length; i++) {
    let ball = ball_list[i];
    if (ball.collidecircle(influence_rect)) {
      ball.velocity = utils.scale_coord(influence_rect.get_unit_normal(ball), influence_rect.radius * 2 / utils.distance_between(influence_rect.center, ball.center));
    }
  }
});

game_canvas.addEventListener("touchmove", (e) => {
  mouse_down = true;
  e.preventDefault();

  for (let i = 0; i < e.touches.length; i++) {
    let x = e.touches[i].pageX;
    let y = e.touches[i].pageY;

    let influence_rect = new Rect(0, 0, 500, 500);
    influence_rect.center = [x, y];
    for (let i = 0; i < ball_list.length; i++) {
      let ball = ball_list[i];
      if (ball.collidecircle(influence_rect)) {
        ball.velocity = utils.scale_coord(influence_rect.get_unit_normal(ball), influence_rect.radius * 2 / utils.distance_between(influence_rect.center, ball.center));
      }
    }
  }
});

setInterval(step, 1000 / FPS);
