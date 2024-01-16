class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = null;
    this.fulfilledCallbacks = [];
    this.rejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.executeCallbacks(this.fulfilledCallbacks, value);
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.value = reason;
        this.executeCallbacks(this.rejectedCallbacks, reason);
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const fulfilledHandler = (value) => {
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
      };

      const rejectedHandler = (reason) => {
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
      };

      if (this.state === 'fulfilled') {
        fulfilledHandler(this.value);
      } else if (this.state === 'rejected') {
        rejectedHandler(this.value);
      } else {
        this.fulfilledCallbacks.push(fulfilledHandler);
        this.rejectedCallbacks.push(rejectedHandler);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  executeCallbacks(callbacks, value) {
    setTimeout(() => {
      callbacks.forEach((callback) => {
        callback(value);
      });
    }, 0);
  }
}

module.exports = MyPromise;