class Points {
  constructor() {
    this.mainObj = {};
    this.length = 0;
  }
  set(x, y, z, value) {
    if (this.mainObj[x]) {
      if (this.mainObj[x][y]) {
        if (!this.mainObj[x][y][z]) {
          this.length++
        }
        this.mainObj[x][y][z] = value;
      } else {
        this.mainObj[x][y] = {};
        this.mainObj[x][y][z] = value;
        this.length++
      }
    } else {
      this.mainObj[x] = {};
      this.mainObj[x][y] = {};
      this.mainObj[x][y][z] = value;
      this.length++
    }
  }
  append(x, y, z, value) {
    if (this.mainObj[x]) {
      if (this.mainObj[x][y]) {
        if (!this.mainObj[x][y][z]) {
          this.mainObj[x][y][z] = [value];
          this.length++
        }
        this.mainObj[x][y][z].push(value);
      } else {
        this.mainObj[x][y] = {};
        this.mainObj[x][y][z] = [value];
        this.length++
      }
    } else {
      this.mainObj[x] = {};
      this.mainObj[x][y] = {};
      this.mainObj[x][y][z] = [value];
      this.length++
    }
  }
  get(x, y, z) {
    if (this.mainObj[x] && this.mainObj[x][y] && this.mainObj[x][y][z]) {
      return this.mainObj[x][y][z]
    } else {
      return undefined;
    }
  }
  delete(x, y, z) {
    if (this.mainObj[x] && this.mainObj[x][y] && this.mainObj[x][y][z]) {
      const xKeys = Object.keys(this.mainObj[x]);
      const yKeys = Object.keys(this.mainObj[x][y]);
      if (yKeys.length === 1 && xKeys.length > 1) {
        delete this.mainObj[x][y]
        this.length--;
      } else if (xKeys.length === 1) {
        delete this.mainObj[x]
        this.length--;
      } else {
        delete this.mainObj[x][y][z]
        this.length--;
      }
    } else {
      return undefined;
    }
  }
  getArray() {
    const finalArray = [];
    const xKeys = Object.keys(this.mainObj);
    for (var x = 0; x < xKeys.length; x++) {
      const yKeys = Object.keys(this.mainObj[xKeys[x]]);
      for (var y = 0; y < yKeys.length; y++) {
        const zKeys = Object.keys(this.mainObj[xKeys[x]][yKeys[y]]);
        for (var z = 0; z < zKeys.length; z++) {
          finalArray.push({
            x: parseFloat(xKeys[x]),
            y: parseFloat(yKeys[y]),
            z: parseFloat(zKeys[z]),
            value: this.get(xKeys[x], yKeys[y], zKeys[z])
          });
        }
      }
    }
    return finalArray;
  }
}

export default Points;