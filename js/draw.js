import * as utils from "./utils.js";

export class DrawTool {
  constructor(canvas = null) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  set["ctx"](ctx) {
    this.context = ctx;
  }

  get["ctx"]() {
    return this.context;
  }

  clear(fill = "white") {
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  rect(r, filled = true) {
    if (filled) {
      this.ctx.fillStyle = r.color;
      this.ctx.fillRect(r.x, r.y, r.w, r.h);
    } else {
      this.ctx.strokeStyle = r.color;
      this.ctx.strokeRect(r.x, r.y. r.w, r.h);
    }
  }

  ellipse(r, filled = true) {
    this.ctx.beginPath();
    this.ctx.ellipse(r.centerx, r.centery, r.w / 2, r.h / 2, 0, 0, Math.PI * 2);
    if (filled) {
      this.ctx.fillStyle = r.color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = r.color;
      this.ctx.stroke();
    }
  }

  crown(r) {
    var circle_radius = Math.min(r.w / 8, r.h / 8)
    var point1 = [r.left + circle_radius, r.top + circle_radius * 3];
    var point2 = [r.centerx, r.top + circle_radius];
    var point3 = [r.right - circle_radius, r.top + circle_radius * 3];
    var inner_l = [r.left + r.w / 3, r.top + 3 * r.h / 5];
    var inner_r = [r.right - r.w / 3, r.top + 3 * r.h / 5];
    var bottomleft = [r.left + circle_radius * 2, r.bottom];
    var bottomright = [r.right - circle_radius * 2, r.bottom];

    var circle_points = [point1, point2, point3];

    this.ctx.fillStyle = r.color;

    this.ctx.beginPath();
    this.ctx.moveTo(point1[0], point1[1]);
    this.ctx.lineTo(bottomleft[0], bottomleft[1]);
    this.ctx.lineTo(bottomright[0], bottomright[1]);
    this.ctx.lineTo(point3[0], point3[1]);
    this.ctx.lineTo(inner_r[0], inner_r[1]);
    this.ctx.lineTo(point2[0], point2[1]);
    this.ctx.lineTo(inner_l[0], inner_l[1]);
    this.ctx.lineTo(point1[0], point1[1]);
    this.ctx.fill();

    for (let p = 0; p < circle_points.length; p++) {
      this.ctx.beginPath();
      this.ctx.arc(circle_points[p][0], circle_points[p][1], circle_radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  line_interp_width(from, to, w1, w2) {
    var x1 = from[0];
    var y1 = from[1];
    var x2 = to[0];
    var y2 = to[1];

    var dx = (x2 - x1)
    var shiftx = 0;
    var dy = (y2 - y1)
    var shifty = 0;

    w1 /= 2;
    w2 /= 2;

    var length = utils.distance_between(from, to);

    if (length < 0) {
      return;
    }

    dx /= length;
    dy /= length;
    shiftx = -dy * w1;
    shifty = dx * w1;
    var angle = Math.atan2(shifty, shiftx);
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + shiftx, y1 + shifty);
    this.ctx.arc(x1, y1, w1, angle, angle + Math.PI);
    shiftx = -dy * w2 ;
    shifty = dx * w2 ;
    this.ctx.lineTo(x2 - shiftx, y2 - shifty);
    this.ctx.arc(x2, y2, w2, angle + Math.PI, angle);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
