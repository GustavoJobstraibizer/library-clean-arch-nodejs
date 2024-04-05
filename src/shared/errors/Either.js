module.exports = class Either {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  static left(value) {
    return new Either(value, null);
  }

  static right(value) {
    return new Either(null, value);
  }

  fold(leftFn, rightFn) {
    return this.left ? leftFn(this.left) : rightFn(this.right);
  }
};
