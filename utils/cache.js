const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const client = redis.createClient(process.env.REDIS_URL);
// Promisify the redis hget method to make it able to await
client.hget = util.promisify(client.hget);
// Keeping the default implementation of the exec
// method in case the data is not in the cache
const exec = mongoose.Query.prototype.exec;

// Using the cache meth.REDIS_URL.
mongoose.Query.prototype.cache = function (options = {}) {
  this.isCached = true;
  this.hashKey = options.key;
  // returning this to make the method chainable
  return this;
};

// Override the exec method to access the query before executing
// and then check if the cache contain a value with this query
// so we don't need to go through the database again.

mongoose.Query.prototype.exec = async function () {
  // Check first if u want to use cache over this query or not,
  // if not call the exec method directly
  if (!this.isCached) return exec.apply(this, arguments);
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  // Get the result from the cache using the query string
  const cachedValue = await client.hget(this.hashKey, key);
  if (cachedValue) {
    const doc = JSON.parse(cachedValue);
    // The returned value must be a mongo model not a JSON object
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : [new this.model(doc)];
  }

  // the cache does not contain the result and we need to get the result
  // from the database then cache it using the query string as the key
  const value = await exec.apply(this, arguments);
  client.hset(this.hashKey, key, JSON.stringify(value), "EX", 30);
  return value;
};
