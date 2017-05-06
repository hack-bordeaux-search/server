const algoliasearch = require('algoliasearch');
var algoliaClient = algoliasearch('applicationID', 'apiKey');

const pushDataAlgolia = function(data, callback) {
    var index = algoliaClient.initIndex('alias');
    index.addObjects(data, function(err, content) {
        if (err) {
            console.error(err);
            callback(error);
            return;
        }
    });
    callback(null);
};