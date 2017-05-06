const algoliasearch = require('algoliasearch');
var algoliaClient = algoliasearch('RMCV5125OB', '754239ab783a2df84107f3b5acee193b');
const bodyParser = require('body-parser')

const express = require('express');
let app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const pushDataAlgolia = function(data, callback) {
    var index = algoliaClient.initIndex('alias');
    index.addObjects(data, function(err, content) {
        if (err) {
            console.error(err);
            callback(err);
            return;
        }
        else callback(null);
    });
    //
};



app.post('/alias', function (req, res) {
    if(!req.body) return res.status(500).send({message: "Body empty"});
    if(!req.body.alias) return res.status(500).send({message: "Alias is not in body"});
    if(!req.body.social_accounts) return res.status(500).send({message: "social_accounts is not in body"});
    pushDataAlgolia([req.body], (err)=> {
        if(err) return res.send(err);
        return res.status(200).send({message: "Alias created succesfully"});
    });
    return;
});

app.listen(3000);