const redis = require("redis");
const client = redis.createClient(process.env.Redis_URL);

exports.deleteKey = async (req, res, next) => {
  await next();
  client.del(req.originalUrl, (err, response) => {
    if (response == 1) console.log("this api cache is deleted successfully");
  });
};

// for deleteing multiple keys with a certain prefix
exports.deleteKeysWithPrefix = function (prefix) {
  return (req, res, next) => {
    client.keys(prefix + "*", (err, keys) => {
      if (err) {
        console.error("Error:", err);
        return;
      }

      if (keys.length === 0) {
        console.log("No keys found with the specified prefix.");
        return;
      }

      // Use multi to perform multiple DEL commands in a single transaction
      const multi = client.multi();

      keys.forEach((key) => {
        multi.del(key);
      });

      // Execute the transaction
      multi.exec((delErr, replies) => {
        if (delErr) {
          console.error("Error deleting keys:", delErr);
        } else {
          console.log(
            `Deleted ${replies.length} keys with prefix "${prefix}".`
          );
        }
      });
    });
    next();
  };
};
