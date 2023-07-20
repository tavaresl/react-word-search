declare global {
  interface Array<T> {
    shuffle(): Array<T>
  }
}

if (!Array.prototype.shuffle) {
  Array.prototype.shuffle = function() {
    const newArray = this.slice(0);

    for (var i = newArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }

    return newArray;
  };
}

export {};
