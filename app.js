const algoliasearch = require('algoliasearch');
var algoliaClient = algoliasearch('UKEL8J5F7R', '00eefa36b5cbcfc9eb4252e6c1c9eb87');

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