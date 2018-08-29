const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("deleteSpeaker function processing request");
  if (req.query.id) {
    //connect to CosmosDB
    mongo.connect(
      process.env.speakers_COSMOSDB,
      (err, client) => {
        let send = response(client, context);
        if (err) send(500, err.message);
        let db = client.db("acloudguru");
        let speakerId = parseInt(req.query.id);
        db.collection("speakers").deleteOne(
          { id: speakerId },
          (err, result) => {
            if (err) send(500, err.message);

            send(200, "");
          }
        );
      }
    );
  } else {
    context.res = {
      status: 400,
      body: "Please pass name in the body"
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
