const axios = require('axios');
const uuid = require('uuid').v4;
const mongo = require('mongodb').MongoClient;

module.exports = function (context, req) {
    context.log('createSpeaker function processing request');
    if (req.body) {
        let speakerData = req.body;
        //connect to Mongo and list the items
        mongo.connect(process.env.speakers_COSMOSDB, (err, client) => {
            if (err) send(500, err.message);     
            let db = client.db('acloudguru');      
            db.collection('speakers').insertOne(
              speakerData,
              (err, speakerData) => {
                if (err)  { send(500, err.message);} 
                else {
                    publishToEventGrid(speakerData)
                    context.res = {
                    status: 200,
                    body: speakerData
                  };
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
    client.close();
    context.done();
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
function publishToEventGrid(speaker)  {
  console.log("in publishToEventGrid function")
    const topicKey = "dxHLQK2zZL4toMXBDn38gp9qtcEtamps4E0p7tmhBXY="
    const topicHostName = "https://acg-eg-topic.westeurope-1.eventgrid.azure.net/api/events"
    let data = speaker
    let events = [
    {
    id: uuid(),
    subject: 'New Speaker Image Created',
    dataVersion: '1.0',
    eventType: 'Microsoft.MockPublisher.TestEvent',
    eventTime: new Date(),
    data: speaker.ops
        }
    ];
    console.log("Here is the event data: ",events[0].data);
    axios.post(topicHostName,events, {
      headers: { 'aeg-sas-key' : topicKey }})
}
