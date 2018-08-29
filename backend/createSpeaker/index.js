const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("createSpeaker function processing request");
  context.log("req.body", req.body);
  if (req.body) {
    let speakerData = req.body;
    //connect to Mongo and list the items
    mongo.connect(
      process.env.speakers_COSMOSDB,
      (err, client) => {
        context.log(err);
        context.log(client);
        let send = response(client, context);
        if (err) send(500, err.message);
        let db = client.db("acloudguru");
        db.collection("speakers").insertOne(speakerData, (err, speakerData) => {
          if (err) send(500, err.message);

          send(200, speakerData);
        });
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
