import {dot, scale_coord, project, get_direction, distance_between, angle_between, distance_in_direction, add_coord, get_speed, radians, degrees} from "./utils.js";
import {Vector} from "./vector.js";
import {Rect} from "./rect.js";

export class Ball extends Rect {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.color = "black";
    this.velocity = new Vector(0, 0);
    this.mass = 1;
  }

  bounce_inelastic_2d(other) {
    let both_new_velocity = this.velocity.scale(this.mass).add(other.velocity.scale(other.mass)).scale(1 / (this.mass + other.mass));
    this.velocity = both_new_velocity;
    other.velocity = both_new_velocity;
  }

  bounce_elastic_2d(other, damping = 1.05) {
    let n = this.get_unit_normal(other);
    let t = new Vector(-n.at(1), n.at(0));

    let this_nvect = this.velocity.project(n);
    let other_nvect = other.velocity.project(n);
    let this_tvect = this.velocity.project(t);
    let other_tvect = other.velocity.project(t);

    let t_new_nvect = this_nvect.scale(this.mass - other.mass).add(other_nvect.scale(2 * other.mass)).scale(1 / (damping * (this.mass + other.mass)));
    let o_new_nvect = other_nvect.scale(other.mass - this.mass).add(this_nvect.scale(2 * this.mass)).scale(1 / (damping * (other.mass + this.mass)));

    //let t_new_nvect = scale_coord((add_coord(scale_coord(this_nvect, (this.mass - other.mass)), scale_coord(other_nvect, 2 * other.mass))), 1 / (damping * (this.mass + other.mass)));
    //let o_new_nvect = scale_coord((add_coord(scale_coord(other_nvect, (other.mass - this.mass)), scale_coord(this_nvect, 2 * this.mass))), 1 / (damping * (other.mass + this.mass)));

    let this_new_velocity = t_new_nvect.add(this_tvect);
    let other_new_velocity = o_new_nvect.add(other_tvect);

    this.velocity = this_new_velocity;
    other.velocity = other_new_velocity;
  }

  move_outside_circle(other) {
    if (this.collidecircle(other)) {
      let dir = angle_between(other.center, this.center);
      let targ_dist = this.radius + other.radius;
      let curr_dist = distance_between(this.center, other.center);
      let move_dist = targ_dist - curr_dist;

      let clearance = 1;

      if (this.mass <= other.mass) {
        this.move_in_direction(move_dist + clearance, dir);
      } else {
        other.move_in_direction(-(move_dist + clearance), dir);
      }
    }
  }

  bouncerect_inner(other, damping = 1) {
    if (other.contains(this)) {
      return;
    }

    if (this.left < other.left) {
      this.left = other.left;
      this.xspeed = (1 / damping) * Math.abs(this.xspeed);
    }
    if (this.top < other.top) {
      this.top = other.top;
      this.yspeed = (1 / damping) * Math.abs(this.yspeed);
    }
    if (this.right > other.right) {
      this.right = other.right;
      this.xspeed = -(1 / damping) * Math.abs(this.xspeed);
    }
    if (this.bottom > other.bottom) {
      this.bottom = other.bottom;
      this.yspeed = -(1 / damping) * Math.abs(this.yspeed);
    }
  }

  get["momentum"]() {
    return this.velocity.magnitude * this.mass;
  }

  get["xspeed"]() {
    return this.velocity.at(0);
  }

  set["xspeed"](val) {
    this.velocity.coord[0] = val;
  }

  get["yspeed"]() {
    return this.velocity.at(1);
  }

  set["yspeed"](val) {
    this.velocity.coord[1] = val;
    this.velocity.coord[1] = val;
  }
}
