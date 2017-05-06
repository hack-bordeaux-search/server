const algoliasearch = require('algoliasearch');
var algoliaClient = algoliasearch('RMCV5125OB', '754239ab783a2df84107f3b5acee193b');
const bodyParser = require('body-parser')

const express = require('express');
let app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


var port = process.env.PORT || 3000;
app.listen(port);


let index = algoliaClient.initIndex('alias');

const pushDataAlgolia = function(data, callback) {
    
    index.addObject(data, function(err, content) {
        if (err) {
            console.error(err);
            callback(err);
        }
        else callback(null);
    });
};


const updateAlias = function(body, obj, callback) {
    index.getObject(obj.ObjectID, function(err, content) {
        let updatedContent = content;
        for(let newElem of body.social_accounts) {
            let exists = false;
            for(let oldElem of obj.social_accounts) {
                if(oldElem.id === newElem.id) {
                    oldElem.username = newElem.username;
                    exists = true;
                    break;
                }
            }
            if(!exists) obj.social_accounts.push(newElem);
        }
        index.saveObject(obj, function(err, content) {
            if(err) return callback(err);
            callback(null);
        });
    });
};

const searchAlias = function(aliasValue, callback) {
    index.search(aliasValue, {
    // attributesToRetrieve: ['ObjectID', 'alias'],
    hitsPerPage: 1
    }, function searchDone(err, content) {
        if (err) {
            console.error(err);
            return;
        }
        if(content.hits.length > 0 && content.hits[0].alias === aliasValue) callback(content.hits[0]);
        else callback(null);
        return;
    });
}


app.post('/alias', function (req, res) {
    if(!req.body) return res.status(500).send({message: "Body empty"});
    if(!req.body.alias) return res.status(500).send({message: "Alias is not in body"});
    if(!req.body.social_accounts) return res.status(500).send({message: "social_accounts is not in body"});

    searchAlias(req.body.alias, (exists)=> {
        if(exists) return res.status(500).send({message: "The alias is not available"});
        pushDataAlgolia(req.body, (err)=> {
            if(err) return res.send(err);
            return res.status(200).send({message: "Alias created succesfully"});
        });
    })
    return;
});

app.put('/alias', function (req, res) {
    if(!req.body) return res.status(500).send({message: "Body empty"});
    if(!req.body.alias) return res.status(500).send({message: "Alias is not in body"});
    if(!req.body.social_accounts) return res.status(500).send({message: "social_accounts is not in body"});

    searchAlias(req.body.alias, (aliasElem)=> {
        if(!aliasElem) return res.status(404).send({message: "The alias not exists"});
        updateAlias(req.body, aliasElem, (err) => {
            if(err) return res.status(500).send(err);
            return res.status(200).send({message: "Updated alias"});
        })
    });
    return;
});

