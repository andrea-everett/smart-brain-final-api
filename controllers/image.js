const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "746a5b15da834a9a8149083e99b062e6");

stub.PostModelOutputs = (req, res) => 
    {
        app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
             res.json(data);
        })
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
    }

// const handleApiCall = (req, res) => {
//     app.models
//     .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
//     .then(data => {
//          res.json(data);
//     })
//     .catch(err => res.status(400).json('unable to work with API'))
// };

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id) 
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    // handleApiCall
}
