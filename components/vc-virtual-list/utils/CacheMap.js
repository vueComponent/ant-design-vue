// Firefox has low performance of map.
class CacheMap {
  maps;

  constructor() {
    this.maps = {};
    this.maps.prototype = null;
  }

  set(key, value) {
    this.maps[key] = value;
  }

  get(key) {
    return this.maps[key];
  }
}

export default CacheMap;
