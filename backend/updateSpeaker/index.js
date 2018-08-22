var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;  

module.exports = function (context, req) {
    context.log('updateSpeaker function processing request');
    if (req.body) {
        let speakerData = req.body;
        mongo.connect(process.env.speakers_COSMOSDB, (err, client) => {
            let send = response(client, context);       
            if (err) send(500, err.message);     
            let db = client.db('acloudguru');    
            speakerData.id = req.query.id
            db.collection('speakers').updateOne(
                {_id: new ObjectID(speakerData.id) },
                { $set: {name: speakerData.name, title : speakerData.title, location : speakerData.location, skills : speakerData.skills }},
              (err, speakerData) => {
                if (err) send(500, err.message);
        
                send(200, speakerData);
              }
            );
          });
    }
    else {
       context.res = {
            status: 400,
            body: "Please pass name in the body"
        }; 
    }
}

function response(client, context) {
    return function(status, body) {
      context.res = {
        status: status,
        body: body
      };
  
      client.close();
      context.done();
    };
};