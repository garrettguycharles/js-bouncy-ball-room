export class Vector {
  constructor() {
    if (arguments.length == 1) {
      this.coord = Array.from(arguments[0]);
    } else {
      this.coord = Array.from(arguments);
    }
  }

  at(i) {
    return this.coord[i];
  }

  add(other) {
    if (this.dimension !== other.dimension) {
      throw new TypeError("Tried to add vectors of unequal dimension: " + this.dimension.toString() + ", " + other.dimension.toString());
    }

    let to_return = [];
    for (let i = 0; i < this.dimension; i++) {
      to_return.push(this.at(i) + other.at(i));
    }
    return new Vector(to_return);
  }

  subtract(other) {
    if (this.dimension !== other.dimension) {
      throw new TypeError("Tried to subtract vectors of unequal dimension: " + this.dimension.toString() + ", " + other.dimension.toString());
    }

    let to_return = [];
    for (let i = 0; i < this.dimension; i++) {
      to_return.push(this.at(i) - other.at(i));
    }
    return new Vector(to_return);
  }

  scale(scalar) {
    let to_return = [];
    for (let i = 0; i < this.dimension; i++) {
      to_return.push(this.at(i) * scalar);
    }

    return new Vector(to_return);
  }

  dot(other) {
    if (this.dimension !== other.dimension) {
      throw new TypeError("Tried to dot multiply vectors of unequal dimension: " + this.dimension.toString() + ", " + other.dimension.toString());
    }
    let to_return = 0;
    for (let i = 0; i < this.dimension; i++) {
      to_return += this.at(i) * other.at(i);
    }

    return to_return;
  }

  project(onto) {
    let scalar = (this.dot(onto) / onto.dot(onto));
    return onto.scale(scalar);
  }

  get["dimension"]() {
    return this.coord.length;
  }

  get["magnitude"]() {
    return Math.sqrt(this.dot(this));
  }
}
