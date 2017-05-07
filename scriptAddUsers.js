const request = require('request-promise');
const names = ["david", "cristian", "remi", "steve", "tom", "tim", "davide", "christian"];
const crypto = require('crypto');

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

for(let name of names) {

	for(let i = 0; i < 10; i++) {
		let postBody = {
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
					"username": "0x" + randomValueHex(40)
				},
				{
					"id": "nem",
					"username": "0x" + randomValueHex(40)
				}
			]
		};

		let params = {method: 'PUT',
	      uri: "http://localhost:3000/alias/" + name + String(i),
	      body: postBody,
	      json: true
	    };

	    request(params)
	    .then(function(resp) {
	    	return console.log(resp);
	    })
	    .catch((err)=> {
	      return console.log(err);
	    });
		console.log(postBody);
	}
}





