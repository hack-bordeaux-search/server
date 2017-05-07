const algoliasearch = require('algoliasearch');
var algoliaClient = algoliasearch('RMCV5125OB', '754239ab783a2df84107f3b5acee193b');
const bodyParser = require('body-parser')

const express = require('express');
let app = express();
let nem = require("nem-sdk").default;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var port = process.env.PORT || 3000;
var private_key = process.env.PRIVATE_KEY || "nokey";
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
    let aliasInfo = {};
    if(!req.body) return res.status(500).send({message: "Body empty"});
    if(!req.body.alias) return res.status(500).send({message: "Alias is not in body"});
    aliasInfo.alias = req.body.alias;
    if(!req.body.social_accounts) return res.status(500).send({message: "social_accounts is not in body"});
    aliasInfo.social_accounts = req.body.social_accounts;

    if(!req.body.profile || !req.body.profile.name || !req.body.profile.idnumber || !req.body.profile.country) {
        return res.status(500).send({message: "Personal information not complete"});
    }
    let profile = req.body.profile;
 

    searchAlias(aliasInfo.alias, (exists)=> {
        if(exists) return res.status(500).send({message: "The alias is not available"});
        pushDataAlgolia(aliasInfo, (err)=> {
            if(err) return res.send(err);
             // Create an NIS endpoint object
            var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

            // Create a common object holding key
            var common = nem.model.objects.create("common")("", "d0733ac5bbf26156280f52a8377003760b5e5b000ed5669a79a54fd01df9933a");

            // Create an un-prepared transfer transaction object
            var transferTransaction = nem.model.objects.create("transferTransaction")("TAYNFJAASOQ445STMYOWQ6IQVR2AH44AMJXDYRHC", 0, JSON.stringify(profile));

            // Prepare the transfer transaction object
            var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

            // Serialize transfer transaction and announce
            nem.model.transactions.send(common, transactionEntity, endpoint);
            return res.status(200).send({message: "Alias created succesfully"});
        });
    })
    return;
});

app.put('/alias/:id', function (req, res) {
    if(!req.body) return res.status(500).send({message: "Body empty"});
    if(!req.params.id) return res.status(500).send({message: "Alias is not in body"});
    if(!req.body.social_accounts) return res.status(500).send({message: "social_accounts is not in body"});

    req.body.alias = req.params.id;

    searchAlias(req.body.alias, (aliasElem)=> {
        if(!aliasElem) return res.status(404).send({message: "The alias not exists"});
        updateAlias(req.body, aliasElem, (err) => {
            if(err) return res.status(500).send(err);
            return res.status(200).send({message: "Updated alias"});
        })
    });
    return;
});

app.get('/alias/:id/check', function (req, res) {
    searchAlias(req.params.id, (aliasElem)=> {
        if(!aliasElem) return res.status(200).send({available: true});
        if(aliasElem) return res.status(200).send({available: false});
    });
});


app.get('/alias/:id', function(req, res) {
    if(!req.params.id || req.params.id === "") return res.status(200).send([]);
    let aliasName = req.params.id;
    let query = req.query;
    index.search(aliasName, {
    restrictSearchableAttributes: ['alias']
    }, function searchDone(err, content) {
        if (err) return res.status(500).send(err);
        
        let aliases = [];
        for(let elem of content.hits) {
            let aliasUsername = {};
            aliasUsername.alias = elem.alias;
            for(let serviceElem of elem.social_accounts) {
                if(serviceElem.id === query.service) aliasUsername.username = serviceElem.username;
            }
            if(aliasUsername.username) aliases.push(aliasUsername);
            
        }
        return res.status(200).send(aliases);
    });

});