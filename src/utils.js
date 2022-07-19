export function round(num, precision) {
    precision = Math.pow(10, precision)
    return Math.round(num * precision) / precision
  }

export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }