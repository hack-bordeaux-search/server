let request = require('request-promise');
let names = ["david", "cristian", "remi", "steve", "tom", "tim", "davide", "christian"];

for(let name of names) {
	for(let i = 0; i < 10; i++) {
		let postBody = {
			"alias": name + String(i),
			"profile": {
				"name": "name name name",
				"idnumber": "123456789A",
				"country": "Spain"
			}, 
			"social_accounts": [
				{
					"id": "facebook",
					"username": name + String(i) + String(i) + + String(i)
				},
				{
					"id": "twitter",
					"username": name + String(i) + "_"+  String(i) + String(i)
				},
				{
					"id": "instagram",
					"username": name + String(i) + String(i) + "_" + String(i)
				},
				{
					"id": "bitcoin",
					"username": name + "_bitcoin_" + String(i) + String(i) + String(i)
				},
				{
					"id": "nem",
					"username": name + "__nem__" + String(i) + String(i) + String(i)
				}
			]
		};

		

		let params = {method: 'POST',
	      uri: "http://localhost:3000/alias",
	      body: postBody,
	      json: true
	    };

	    console.log(params);

	    request(params)
	    .then(function(resp) {
	    	return console.log(resp);
	    })
	    .catch((err)=> {
	      return console.log(err);
	    });
	}
}





