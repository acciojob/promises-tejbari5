class MyPromise {
    constructor(executor) {
      this.state = 'pending';
      this.value = null;
      this.onFulfilledCallbacks = [];
      this.onRejectedCallbacks = [];
  
      const resolve = (value) => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          this.onFulfilledCallbacks.forEach(callback => {
            queueMicrotask(() => {
              try {
                const result = callback(this.value);
                if (result instanceof MyPromise) {
                  result.then(resolve, reject);
                } else {
                  resolve(result);
                }
              } catch (error) {
                reject(error);
              }
            });
          });
        }
      };
  
      const reject = (reason) => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.value = reason;
          this.onRejectedCallbacks.forEach(callback => {
            queueMicrotask(() => {
              try {
                const result = callback(this.value);
                if (result instanceof MyPromise) {
                  result.then(resolve, reject);
                } else {
                  resolve(result);
                }
              } catch (error) {
                reject(error);
              }
            });
          });
        }
      };
  
      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
  
    then(onFulfilled, onRejected) {
      const promise = new MyPromise((resolve, reject) => {
        if (this.state === 'pending') {
          this.onFulfilledCallbacks.push(value => {
            try {
              if (typeof onFulfilled === 'function') {
                const result = onFulfilled(value);
                resolve(result);
              } else {
                resolve(value);
              }
            } catch (error) {
              reject(error);
            }
          });
          this.onRejectedCallbacks.push(reason => {
            try {
              if (typeof onRejected === 'function') {
                const result = onRejected(reason);
                resolve(result);
              } else {
                reject(reason);
              }
            } catch (error) {
              reject(error);
            }
          });
        } else if (this.state === 'fulfilled') {
          queueMicrotask(() => {
            try {
              if (typeof onFulfilled === 'function') {
                const result = onFulfilled(this.value);
                resolve(result);
              } else {
                resolve(this.value);
              }
            } catch (error) {
              reject(error);
            }
          });
        } else if (this.state === 'rejected') {
          queueMicrotask(() => {
            try {
              if (typeof onRejected === 'function') {
                const result = onRejected(this.value);
                resolve(result);
              } else {
                reject(this.value);
              }
            } catch (error) {
              reject(error);
            }
          });
        }
      });
      return promise;
    }
  
    catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  
    get state() {
      return this._state;
    }
  
    set state(state) {
      this._state = state;
    }
  
    get value() {
      return this._value;
    }
  
    set value(value) {
      this._value = value;
    }
  }
  
  module.exports = MyPromise
  
  
  
  
    