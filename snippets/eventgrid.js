const EventGridClient = require("azure-eventgrid");
const msRestAzure = require('ms-rest-azure');
const uuid = require('uuid').v4;


const mongo = require('mongodb').MongoClient;

module.exports = function (context, req) {
    context.log('createSpeaker function processing request');
    context.log("req.body", req.body)
    if (req.body) {
        let speakerData = req.body;
        //connect to Mongo and list the items
        mongo.connect(process.env.speakers_COSMOSDB, (err, client) => {
            context.log(err)
            context.log(client)
            let send = response(client, context);       
            if (err) send(500, err.message);     
            let db = client.db('acloudguru');      
            db.collection('speakers').insertOne(
              speakerData,
              (err, speakerData) => {
                if (err)  { send(500, err.message);} else {
                    publishToEventGrid(speakerData)
                    send(200, speakerData);
                }
        
                
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
};
//Helper function to publish event to eventGrid
function publishToEventGrid(speaker) => {

    const topicKey = ""
    const subscriptionID = ""
    const topicHostName = ""

    let topicCreds = new msRestAzure.TopicCredentials(topicKey);
    let EGClient = new EventGridClient(topicCreds, subscriptionID);
    let events = [
    {
    id: uuid(),
    subject: 'New Speaker Image Created',
    dataVersion: '1.0',
    eventType: 'Microsoft.MockPublisher.TestEvent',
    data: {
            id: speaker.id,
            uri: speaker.headshotUri
            }
        }
    ];
    return EGClient.publishEvents(topicHostName, events).then((result) => {
    return Promise.resolve(console.log('Published events successfully.'));
    }).catch((err) => {
    console.log('An error ocurred');
    console.dir(err, {depth: null, colors: true});
    });

}
