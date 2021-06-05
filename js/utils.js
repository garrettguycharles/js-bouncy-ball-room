export function radians(deg) {
  return deg * Math.PI / 180;
}

export function degrees(rad) {
  return rad * 180 / Math.PI;
}

export function distance_in_direction(dist, theta) {
  var x = dist * Math.cos(radians(theta));
  var y = dist * Math.sin(radians(theta));

  return [x, y];
}

export function distance_between(pos1, pos2) {
  var dx = pos2[0] - pos1[0];
  var dy = pos2[1] - pos1[1];

  return Math.sqrt(dx * dx + dy * dy);
}

export function get_direction(coord) {
  return degrees(Math.atan2(coord[1], coord[0]));
}

export function angle_between(start, dest) {
  var dx = dest[0] - start[0];
  var dy = dest[1] - start[1];

  return get_direction([dx, dy]);
}

export function get_speed(xspeed, yspeed) {
  return Math.sqrt(xspeed * xspeed + yspeed * yspeed);
}

export function add_coord(c1, c2) {
  return [c1[0] + c2[0], c1[1] + c2[1]];
}

export function random_range(a, b) {
  let diff = b - a;
  diff += 1
  return Math.floor(Math.random() * diff) + a;
}

export function magnitude(v) {
  return Math.sqrt(dot(v, v));
}

export function dot(u, v) {
  let to_return = 0;
  for (let i = 0; i < u.length; i++) {
    to_return += u[i] * v[i];
  }

  return to_return;
}

export function project(v, onto) {
  let scalar = (dot(v, onto) / dot(onto, onto));
  return scale_coord(onto, scalar);
}

export function scale_coord(coord, scalar) {
  let to_return = [];
  for (let i = 0; i < coord.length; i++) {
    to_return.push(coord[i] * scalar);
  }

  return to_return;
}

export function rem_to_px(r) {
    return r * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getMousePosRel(element, e) {
    var rect = element.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}
