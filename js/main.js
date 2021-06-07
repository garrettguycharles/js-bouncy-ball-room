import * as utils from "./utils.js";
import {Rect} from "./rect.js";
import {DrawTool} from "./draw.js";
import {Graph, Node} from "./graph.js";


let FPS = 60

let game_canvas = document.getElementById("game");
game_canvas.width = window.innerWidth;
game_canvas.height = window.innerHeight;

// set game width and height here, if necessary

let screen_context = game_canvas.getContext("2d");
let brush = new DrawTool(game_canvas);
let screen = new Rect(0, 0, game_canvas.width, game_canvas.height);
let MAX_LAUNCH_SPEED = 15;
let LAUNCH_RADIUS = 100;

let background_color = "#ffffff";

let gravity = 0.5;
let friction = 0.995;

let mouse_down = false;

let ball_list = [];
let color_ball_list = [];
let draw_line_list = [];

let next_level_timeout = null;

let num_balls = Math.min((screen.w * screen.h) / Math.pow(75, 2), 100);

let num_color_balls = 2;

function setup_level() {
  next_level_timeout = null;

  ball_list = [];
  color_ball_list = [];
  draw_line_list = [];

  for (let i = 0; i < num_balls + num_color_balls; i+=1) {
    let r = utils.random_range(10, 40);
    let ball = new Rect(0, 0, r, r);
    ball.mass = utils.sphere_radius_to_volume(ball.radius);
    ball.center = [utils.random_range(screen.left, screen.right), utils.random_range(screen.top, screen.bottom)];
    ball.xspeed = 0; //utils.random_range(-10, 10);
    ball.yspeed = 0; //utils.random_range(-10, 10);
    ball.color = "black";
    ball.connected = false;
    ball_list.push(ball);
  }

  for (let i = 0; i < num_color_balls; i++) {
    ball_list[i].color = utils.get_random_hex_color();
    let r = utils.random_range(15, 30);
    ball_list[i].w = r;
    ball_list[i].h = r;
    ball_list[i].mass = utils.sphere_radius_to_volume(ball_list[i].radius);
    color_ball_list.push(ball_list[i]);
  }

  num_color_balls++;
}

setup_level();

function draw() {
  brush.clear(background_color);

  for (let i = 0; i < draw_line_list.length; i++) {
    let pair = draw_line_list[i];
    let ball = pair[0];
    let otherball = pair[1];

    screen_context.fillStyle = "white"; // utils.average_hex_colors(ball.color, otherball.color);
    brush.line_interp_width(ball.center, otherball.center, ball.w * 1.5, otherball.w * 1.5);

    /*
    screen_context.beginPath();
    screen_context.moveTo(ball.centerx, ball.centery);
    screen_context.lineTo(otherball.centerx, otherball.centery);
    screen_context.strokeStyle = utils.average_hex_colors(ball.color, otherball.color);
    screen_context.lineWidth = ball.radius;
    screen_context.stroke();
    */
  }

  for (let i = 0; i < ball_list.length; i++) {
    brush.ellipse(ball_list[i]);
  }
}

function update() {
  if (next_level_timeout === null) {
    background_color = "#ffffff";
  } else {
    background_color = utils.subtract_hex_colors(background_color, "#020202");
  }
  draw_line_list = [];

  draw_line_list.forEach((ball, i) => {
    ball.connected = false;
  });

  for (let i = 0; i < ball_list.length; i++) {
    let ball = ball_list[i];

    ball.x += ball.xspeed;
    ball.y += ball.yspeed;

    ball.xspeed *= friction;
    ball.yspeed *= friction;

    if (ball.velocity.magnitude < 0.001) {
      ball.xspeed = 0;
      ball.yspeed = 0;
    }

    ball.bouncerect_inner(screen);
    for (let j = 0; j < ball_list.length; j++) {
      let otherball = ball_list[j];
      let both_colored = false;

      if (color_ball_list.includes(ball) && color_ball_list.includes(otherball)) {
        both_colored = true;
      }

      if (ball != otherball) {

        if (both_colored && utils.distance_between(ball.center, otherball.center) < (25 + ball.radius + otherball.radius)) {
          ball.connected = true;
          otherball.connected = true;

          draw_line_list.push([ball, otherball]);
        }

        if (ball.collidecircle(otherball)) {
          ball.move_outside_circle(otherball);
          if (both_colored) {
            ball.bounce_inelastic_2d(otherball);
          } else {
            ball.bounce_elastic_2d(otherball);
          }
        }
      }
    }
    //ball.yspeed += gravity;
  }


  let verify_win = true;

  for (let i = 0; i < color_ball_list.length; i++) {
    if (!color_ball_list[i].connected) {
      verify_win = false;
      break;
    }
  }

  if (verify_win) {
    let graph = new Graph();
    color_ball_list.forEach((ball, i) => {
      graph.add_node(new Node(ball));
    });

    draw_line_list.forEach((pair, i) => {
      let edge = [];
      pair.forEach((ball, i) => {
        edge.push(graph.get_node_from_ball(ball));
      });

      graph.add_edge(edge);
    });

    let is_connected = graph.is_connected();

    if (is_connected) {
      if (next_level_timeout === null) {
        next_level_timeout = setTimeout(setup_level, 3000);
      }
    } else {
      clearTimeout(next_level_timeout);
      next_level_timeout = null;
    }
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
  let influence_rect = new Rect(0, 0, LAUNCH_RADIUS * 2, LAUNCH_RADIUS * 2);
  influence_rect.center = [x, y];
  for (let i = 0; i < ball_list.length; i++) {
    let ball = ball_list[i];
    if (ball.collidecircle(influence_rect)) {
      ball.velocity.coord = utils.scale_coord(influence_rect.get_unit_normal(ball), influence_rect.radius * 2 / utils.distance_between(influence_rect.center, ball.center));
      if (ball.velocity.magnitude > MAX_LAUNCH_SPEED) {
        ball.velocity = ball.velocity.scale(MAX_LAUNCH_SPEED / ball.velocity.magnitude);
      }
    }
  }
});

game_canvas.addEventListener("touchstart", (e) => {
  mouse_down = true;
  let x = e.offsetX;
  let y = e.offsetY;
  let influence_rect = new Rect(0, 0, LAUNCH_RADIUS * 2, LAUNCH_RADIUS * 2);
  influence_rect.center = [x, y];
  for (let i = 0; i < ball_list.length; i++) {
    let ball = ball_list[i];
    if (ball.collidecircle(influence_rect)) {
      ball.velocity.coord = utils.scale_coord(influence_rect.get_unit_normal(ball), influence_rect.radius * 2 / utils.distance_between(influence_rect.center, ball.center));
      if (ball.velocity.magnitude > MAX_LAUNCH_SPEED) {
        ball.velocity = ball.velocity.scale(MAX_LAUNCH_SPEED / ball.velocity.magnitude);
      }
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
  let influence_rect = new Rect(0, 0, LAUNCH_RADIUS * 2, LAUNCH_RADIUS * 2);
  influence_rect.center = [x, y];
  for (let i = 0; i < ball_list.length; i++) {
    let ball = ball_list[i];
    if (ball.collidecircle(influence_rect)) {
      ball.velocity.coord = utils.scale_coord(influence_rect.get_unit_normal(ball), influence_rect.radius * 2 / utils.distance_between(influence_rect.center, ball.center));
      if (ball.velocity.magnitude > MAX_LAUNCH_SPEED) {
        ball.velocity = ball.velocity.scale(MAX_LAUNCH_SPEED / ball.velocity.magnitude);
      }
    }
  }
});

game_canvas.addEventListener("touchmove", (e) => {
  mouse_down = true;
  e.preventDefault();

  for (let i = 0; i < e.touches.length; i++) {
    let x = e.touches[i].pageX;
    let y = e.touches[i].pageY;

    let influence_rect = new Rect(0, 0, LAUNCH_RADIUS * 2, LAUNCH_RADIUS * 2);
    influence_rect.center = [x, y];
    for (let i = 0; i < ball_list.length; i++) {
      let ball = ball_list[i];
      if (ball.collidecircle(influence_rect)) {
        ball.velocity.coord = utils.scale_coord(influence_rect.get_unit_normal(ball), influence_rect.radius * 2 / utils.distance_between(influence_rect.center, ball.center));
        if (ball.velocity.magnitude > MAX_LAUNCH_SPEED) {
          ball.velocity = ball.velocity.scale(MAX_LAUNCH_SPEED / ball.velocity.magnitude);
        }
      }
    }
  }
});

setInterval(step, 1000 / FPS);
