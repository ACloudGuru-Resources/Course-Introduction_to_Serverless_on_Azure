const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  if (req.query.id) {
    //connect to CosmosDB
    mongo.connect(
      process.env.speakers_COSMOSDB,
      (err, client) => {
        let send = response(client, context);
        if (err) send(500, err.message);
        let db = client.db("acloudguru");
        let speakerId = parseInt(req.query.id);
        let query2 = { id: speakerId };
        db.collection("speakers").findOne(query2, (err, result) => {
          if (err) send(500, err.message);
          send(200, JSON.parse(JSON.stringify(result)));
        });
      }
    );
  } else {
    context.res = {
      status: 400,
      body: "Please pass an id in the query string"
    };
  }
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
