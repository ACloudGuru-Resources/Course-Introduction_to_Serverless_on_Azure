module.exports = function (context, req) {
    context.log('createSpeaker function processing request');
    if (req.body && req.body.name) {
        let speakerData = req.body
        context.bindings.speaker = JSON.stringify(speakerData);
    }
    else {
       context.res = {
            status: 400,
            body: "Please pass name in the body"
        }; 
    }
    context.done();
};