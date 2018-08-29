const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("updateSpeaker function processing request");
  if (req.body) {
    let speakerData = req.body;
    //connect to MongoDB
    mongo.connect(
      process.env.speakers_COSMOSDB,
      (err, client) => {
        let send = response(client, context);
        if (err) send(500, err.message);
        let db = client.db("acloudguru");
        speakerId = parseInt(req.query.id);
        db.collection("speakers").updateOne(
          { id: speakerId },
          {
            $set: {
              name: speakerData.name,
              title: speakerData.title,
              location: speakerData.location,
              skills: speakerData.skills,
              headshotUri: speakerData.headshotUri
            }
          },
          (err, speakerData) => {
            if (err) send(500, err.message);
            context.log("speakerData", speakerData);
            send(200, speakerData);
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
