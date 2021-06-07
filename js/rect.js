import {dot, scale_coord, project, get_direction, distance_between, angle_between, distance_in_direction, add_coord, get_speed, radians, degrees} from "./utils.js";
import {Vector} from "./vector.js";
export class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = "black";
    this.velocity = new Vector(0, 0);
    this.mass = 1;
  }

  colliderect(other) {
    if (this.right >= other.left && this.left <= other.right) {
      if (this.bottom >= other.top && this.top <= other.bottom) {
        return true;
      }
    }

    return false;
  }

  colliderect_x(other) {
    if (this.right >= other.left && this.left <= other.right) {
      return true;
    }
    return false;
  }

  colliderect_y(other) {
    if (this.bottom >= other.top && this.top <= other.bottom) {
      return true;
    }
    return false;
  }

  contains(other) {
    if (this.right >= other.right && this.left <= other.left) {
      if (this.bottom >= other.bottom && this.top <= other.top) {
        return true;
      }
    }
    return false;
  }

  contains_y(other) {
    if (this.bottom >= other.bottom && this.top <= other.top) {
      return true;
    }
    return false;
  }

  contains_x(other) {
    if (this.right >= other.right && this.left <= other.left) {
      return true;
    }
    return false;
  }

  collidepoint(pos) {
    if (this.right >= pos[0] && this.left <= pos[0]) {
      if (this.bottom >= pos[1] && this.top <= pos[1]) {
        return true;
      }
    }

    return false;
  }

  collidepoint_x(x) {
    if (this.left <= x && this.right >= x) {
      return true;
    }
    return false;
  }

  collidepoint_y(y) {
    if (this.top <= y && this.bottom >= y) {
      return true;
    }
    return false;
  }

  collides_at_position(pos, other) {
    var temp = this.center;
    this.x = pos[0];
    this.y = pos[1];
    let to_return = this.colliderect(other);
    this.center = temp;
    return to_return;
  }

  collidecircle(other) {
    let dist = this.radius + other.radius;
    if (distance_between(this.center, other.center) <= dist) {
      return true;
    } else {
      return false;
    }
  }

  move_in_direction(distance, theta) {
    this.center = add_coord(this.center, distance_in_direction(distance, theta));
  }

  get_unit_normal(other) {
    let dx = other.centerx - this.centerx;
    let dy = other.centery - this.centery;
    let dist = distance_between(this.center, other.center);
    dx /= dist;
    dy /= dist;
    return new Vector([dx, dy]);
  }

  get["radius"]() {
    return Math.min(this.w / 2, this.h / 2);
  }

  get["left"]() {
    return this.x;
  }

  set["left"](x) {
    this.x = x;
  }

  get["right"]() {
    return this.x + this.w;
  }

  set["right"](x) {
    this.x = x - this.w;
  }

  get["top"]() {
    return this.y;
  }

  set["top"](y) {
    this.y = y;
  }

  get["bottom"]() {
    return this.y + this.h;
  }

  set["bottom"](y) {
    this.y = y - this.h;
  }

  get["centerx"]() {
    return this.x + this.w / 2;
  }

  set["centerx"](x) {
    this.x = x - this.w / 2;
  }

  get["centery"]() {
    return this.y + this.h / 2;
  }

  set["centery"](y) {
    this.y = y - this.h / 2;
  }

  get["center"]() {
    return [this.centerx, this.centery];
  }

  set["center"](tuple) {
    this.centerx = tuple[0];
    this.centery = tuple[1];
  }

  get["topleft"]() {
    return [this.left, this.top];
  }

  set["topleft"](tuple) {
    this.left = tuple[0];
    this.top = tuple[1];
  }

  get["midtop"]() {
    return [this.centerx, this.top];
  }

  set["midtop"](coord) {
    this.centerx = coord[0];
    this.top = coord[1];
  }

  get["topright"]() {
    return [this.right, this.top];
  }

  set["topright"](coord) {
    this.right = coord[0];
    this.top = coord[1];
  }

  get["midleft"]() {
    return [this.left, this.centery];
  }

  set["midleft"](coord) {
    this.left = coord[0];
    this.centery = coord[1];
  }

  get["midright"]() {
    return [this.right, this.centery];
  }

  set["midright"](coord) {
    this.right = coord[0];
    this.centery = coord[1];
  }

  get["bottomleft"]() {
    return [this.left, this.bottom];
  }

  set["bottomright"](coord) {
    this.right = coord[0];
    this.bottom = coord[1];
  }

  get["midbottom"]() {
    return[this.centerx, this.bottom];
  }

  set["midbottom"](coord) {
    this.centerx = coord[0];
    this.bottom = coord[1];
  }

  get["bottomright"]() {
    return [this.right, this.bottom];
  }

  set["bottomright"](coord) {
    this.right = coord[0];
    this.bottom = coord[1];
  }

}
