const algoliasearch = require('algoliasearch');
var algoliaClient = algoliasearch('RMCV5125OB', '754239ab783a2df84107f3b5acee193b');
const bodyParser = require('body-parser')

const express = require('express');
let app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

let index = algoliaClient.initIndex('alias');

const pushDataAlgolia = function(data, callback) {
    
    index.addObjects(data, function(err, content) {
        if (err) {
            console.error(err);
            callback(err);
        }
        else callback(null);
    });
};

<<<<<<< HEAD
const searchAlias = function(aliasValue, callback) {
    index.search(aliasValue, {
    attributesToRetrieve: ['ObjectID', 'alias'],
    hitsPerPage: 1
    }, function searchDone(err, content) {
        if (err) {
            console.error(err);
            return;
        }
        if(content.hits.length > 0) callback(true);
        else callback(false);
        return;
    });
}

=======
>>>>>>> 422f49bcf07f42ea916af76cc45b7add4e6b9ab7
app.post('/alias', function (req, res) {
    if(!req.body) return res.status(500).send({message: "Body empty"});
    if(!req.body.alias) return res.status(500).send({message: "Alias is not in body"});
    if(!req.body.social_accounts) return res.status(500).send({message: "social_accounts is not in body"});

    searchAlias(req.body.alias, (exists)=> {
        if(exists) return res.status(500).send({message: "The alias is not available"});
        pushDataAlgolia([req.body], (err)=> {
            if(err) return res.send(err);
            return res.status(200).send({message: "Alias created succesfully"});
        });
    })
    return;
});

// index.getObject('myID', function(err, content) {
//   console.log(content.objectID + ": " + content.toString());
// });

app.listen(3000);