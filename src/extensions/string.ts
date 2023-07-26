declare global {
    interface String {
      reverse(): string
    }
  }
  
  if (!Array.prototype.shuffle) {
    String.prototype.reverse = function() {
      return Array.from(this).reverse().join('');
    };
  }
  
  export {};
  