const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("getSpeakers function processing request");
  //connect to CosmosDB
  mongo.connect(
    process.env.speakers_COSMOSDB,
    (err, client) => {
      let send = response(client, context);
      if (err) send(500, err.message);
      let db = client.db("acloudguru");
      db.collection("speakers")
        .find({})
        .toArray((err, result) => {
          if (err) send(500, err.message);
          send(200, JSON.parse(JSON.stringify(result)));
        });
    }
  );
};
//Helper function to build the response
function response(client, context) {
  return function(status, body) {
    context.res = {
      status: status,
      body: body
    };

    client.close();
    context.done();
  };
}
