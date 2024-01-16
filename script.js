//your JS code here. If required.
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
        this.executeCallbacks(this.onFulfilledCallbacks, this.value);
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.value = reason;
        this.executeCallbacks(this.onRejectedCallbacks, this.value);
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  executeCallbacks(callbacks, value) {
    while (callbacks.length) {
      const callback = callbacks.shift();

      try {
        const result = callback(value);
        if (result instanceof MyPromise) {
          result.then(
            (resolvedValue) => resolve(result, resolvedValue),
            (rejectedReason) => reject(result, rejectedReason)
          );
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
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
        this.onFulfilledCallbacks.push(fulfilledHandler);
        this.onRejectedCallbacks.push(rejectedHandler);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

const resolve = (result) => {
  console.log(result);
  return result + 10;
};

const reject = (reason) => {
  console.log('error:', reason);
  return reason + 10;
};

const promise = new MyPromise((res, rej) => {
  res(10);
});

promise
  .then(resolve)
  .then(resolve)
  .then(
    (result) => {
      console.log(result);
      throw result + 10;
    },
    reject
  )
  .then(resolve)
  .catch(reject)
  .then(resolve);

console.log('end');