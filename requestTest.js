var request = require('request');

var jsonObj = `{
    "entry.970613639": "Option C",
    "entry.1938922275_sentinel": "",
    "entry.1938922275": "Checkbox C",
    "entry.1882059492": "Dropdown B",
    "entry.561368464": "This was successfully sent as a post request directly to server.",
    "fvv": 1,
    "draftResponse": [null, null, "-4879680781808958389"],
    "pageHistory": 0,
    "fbzx": -4879680781808958389
}`;
/*
var jsonObj = {
    "entry.970613639": "Option B",
    "pageHistory": 0,
};*/

//How to submit JSON data
/*var myRequest = request({
    url: "https://docs.google.com/forms/d/e/1FAIpQLSciNkcZl6T2Tt0ZuFRre-I0hThO5QX8RWAHvaeKC6-FUf67bQ/formResponse",
    method: "POST",
    json: true,
    body: jsonObj
}, function(error, response, body) {
    console.log(response.statusCode);
    console.log(response.headers);
    //console.log(body); 
});*/

//How to submit form urlencoded data
//Note: parsing as JSON is required because of the method type keys in the form.

//Send five requests in succession
var requestCounter = 0;

while (requestCounter < 5) {
    
    var jsonObj = `{
        "entry.970613639": "Option C",
        "entry.1938922275_sentinel": "",
        "entry.1938922275": "Checkbox C",
        "entry.1882059492": "Dropdown B",
        "entry.561368464": "Request #${requestCounter}",
        "fvv": 1,
        "draftResponse": [null, null, "-4879680781808958389"],
        "pageHistory": 0,
        "fbzx": -4879680781808958389
    }`;
    
    
    request({
        url: "https://docs.google.com/forms/d/e/1FAIpQLSciNkcZl6T2Tt0ZuFRre-I0hThO5QX8RWAHvaeKC6-FUf67bQ/formResponse",
        method: "POST",
        form: JSON.parse(jsonObj)
    }, function(error, response, body) {
        console.log(response.statusCode);
    });
    
    requestCounter++;
}

/*
var myRequest = request({
    url: "https://docs.google.com/forms/d/e/1FAIpQLSciNkcZl6T2Tt0ZuFRre-I0hThO5QX8RWAHvaeKC6-FUf67bQ/formResponse",
    method: "POST",
    form: JSON.parse(jsonObj)
}, function(error, response, body) {
    console.log(response.statusCode);
});
*/
