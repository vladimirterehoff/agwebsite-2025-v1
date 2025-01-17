export class FilterBuilder {
  data: any = null;

  constructor(filter: any = null) {
    if (filter) {
      this.data = filter.getJSON() || {};
    } else {
      this.data = {};
    }
  }

  /**
   *
   * @param key:string
   * @returns {*}
   */
  getParams(key: string) {
    return this.data[key];
  }

  /**
   *
   * @param key: string
   * @param value: string | number
   * @returns {FilterBuilder}
   */
  equal(key: string, value: any) {
    this.data[key] = value;
    return this;
  }

  /**
   *
   * @param key: string
   * @param value: string | number
   * @returns {FilterBuilder}
   */
  like(key: string, value: string | number) {
    this.data[key] = {
      operation: 'like',
      value: value,
    };
    return this;
  };

  /**
   *
   * @param key: string
   * @param value: string | number
   * @returns {FilterBuilder}
   */
  not(key: string, value: string | number) {
    this.data[key] = {
      operation: '<>',
      value: value,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @param value: string | number
   * @returns {FilterBuilder}
   */
  greater(key: string, value: string | number) {
    this.data[key] = {
      operation: '>',
      value: value,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @param value: string | number
   * @returns {FilterBuilder}
   */
  less(key: string, value: string | number) {
    this.data[key] = {
      operation: '<',
      value: value,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @param value: string | number
   * @returns {FilterBuilder}
   */
  greaterOrEqual(key: string, value: string | number) {
    this.data[key] = {
      operation: '>=',
      value: value,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @param value: string | number
   * @returns {FilterBuilder}
   */
  lessOrEqual(key: string, value: string | number) {
    this.data[key] = {
      operation: '<=',
      value: value,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @param valueFrom: string | number
   * @param valueTo: string | number
   * @returns {FilterBuilder}
   */
  fromTo(key: string, valueFrom: string | number, valueTo: string | number) {
    this.data[key] = {
      from: valueFrom,
      to: valueTo,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @param value: string | number
   * @returns {FilterBuilder}
   */
  to(key: string, value: string | number) {
    if (!this.data[key]) {
      this.data[key] = {};
    }
    Object.assign(this.data[key], { to: value });
    return this;
  }

  /**
   *
   * @param key: string
   * @param value: any[]
   * @returns {FilterBuilder}
   */
  in(key: string, value: any[]) {
    this.data[key] = {
      operation: 'in',
      value: value,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @param value: any[]
   * @returns {FilterBuilder}
   */
  notIn(key: string, value: any[]) {
    this.data[key] = {
      operation: 'not in',
      value: value,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @returns {FilterBuilder}
   */
  isNull(key: string) {
    this.data[key] = {
      isNull: true,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @returns {FilterBuilder}
   */
  isNotNull(key: string) {
    this.data[key] = {
      isNull: false,
    };
    return this;
  }

  /**
   *
   * @param key: string
   * @returns {FilterBuilder}
   */
  remove(key: string) {
    if (this.data[key]) {
      delete this.data[key];
    }
    return this;
  }
  /**
   *
   * @returns {FilterBuilder}
   */
  reset() {
    this.data = {};
    return this;
  }

  /**
   *
   * @returns {null}
   */
  getJSON() {
    return this.data;
  }

  /**
   *
   * @param data: Object
   * @returns {FilterBuilder}
   */
  extendJSON(data: Record<string, unknown>) {
    Object.assign(this.data, data);
    return this;
  }

  /**
   *
   * @param filter: FilterBuilder
   * @returns {FilterBuilder}
   */
  extend(filter: FilterBuilder) {
    if (filter instanceof FilterBuilder) {
      Object.assign(this.data, filter.getJSON());
    }
    return this;
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this.data);
  }
}

export default FilterBuilder;
