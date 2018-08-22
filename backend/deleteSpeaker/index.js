var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;  

module.exports = function (context, req) {
    context.log('deleteSpeaker function processing request');
    if (req.body) {
        mongo.connect(process.env.speakers_COSMOSDB, (err, client) => {
            let send = response(client, context);       
            if (err) send(500, err.message);     
            let db = client.db('acloudguru');    
            let speakerId = req.query.id
            db.collection('speakers').deleteOne(
                {_id: new ObjectID(speakerId) },
              (err, result) => {
                if (err) send(500, err.message);
        
                send(200, '');
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