/**
* Engine ensures instructions are performed sequentially and properly.
* @class InstructionEngine
* @constructor
*/

var request = require('request'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;


//TODO: This should produce a log file that shows the audit's performance and how each record performed.
class AuditEngine {
    
    //Receives an array of instructions to perform.
    constructor(auditFile) {
        this.auditFile = auditFile;
		this.certs = fs.readFileSync("ca.jdi.pem");
		this.semaphore = 0;
		console.log(this.auditFile);

    }
    
    startAudit() {
        
        var fieldMap = this.buildFieldMap();
		var postArray = []
	
		//Build an object for each record in our dataset.
		this.auditFile.data.forEach((el) => {
			
			var postObj = {};
			
			//Add the actual data
			this.auditFile.dataFields.forEach((dataEl) => {
				postObj[dataEl.auditField] = el[fieldMap[dataEl.dataField]];
			});
			
			//Add the static fields
			this.auditFile.staticFields.forEach((staticEl) => {
				postObj[staticEl.key] = staticEl.value;
			});
			
			postArray.push(postObj);
			
		});
		
		postArray.forEach((postEl) => {
			
			//Semaphore should post progress back to the UI.
			this.semaphore++;
			console.log(this.semaphore);
			this.postRequest(JSON.stringify(postEl));
			
		});
	
		
    }
    
    //Function maps data fields to their index in the array.
    buildFieldMap() {
        
        //For some reason, auditFile.dataFields is only showing 3 entries.
        var fieldMap = {};
        for (let dataFieldObj of this.auditFile.dataFields) {
            fieldMap[dataFieldObj.dataField] = this.auditFile.head.indexOf(dataFieldObj.dataField);
        }
        
        return fieldMap;
        
    }
	
	//Posts the requests asynchronously.
	postRequest(jsonObj) {
		
		//To avoid namespace collision with request object.
		var self = this;
		
		request({
			url: "https://docs.google.com/forms/d/e/1FAIpQLSciNkcZl6T2Tt0ZuFRre-I0hThO5QX8RWAHvaeKC6-FUf67bQ/formResponse",
			method: "POST",
			form: JSON.parse(jsonObj),
			proxy: 'http://jweston:weston160@proxymon:8080', //cannot be https
			ca: this.certs //cannot be agentOptions: {ca: certs}
		}, function(error, response, body) {
			if (error) {
				console.log(error);
			} else {
				self.semaphore--;
				self.emit('posted')
				if (self.semaphore === 0) {
					console.log('emitting event');
					self.emit('done');
				}
			}

		});
		
	}
    
    //Will send the instructions to the browser
    performInstruction(instruction) {
        
        //Perform the instructions.
        //Do the postmortem checks.
        //If check fails, or it is manually terminated by the user, do not proceed. End audit and provide feedback on current position.
        
        
    }
    
    //Will simply call the check engine.
    performCheck(check) {
        
    }
    
    createLog() {

    }
    
    
} //End class InstructionEngine.


//Add event emitting capability to object.
util.inherits(AuditEngine, EventEmitter);
module.exports = AuditEngine;

//Note: Engine needs to be at the Node level to ensure we can interact with files and save logs.


/*
var request = require('request'),
	fs = require('fs');

//Looks like I only need the certificates before Websense
var certs = fs.readFileSync('ca.jdi.pem'); //We need to explictly pass our company's proxy certificate chain in pem format. Stack them up

var jsonObj = `{
	"entry.970613639": "Option C",
	"entry.1938922275_sentinel": "",
	"entry.1938922275": "Checkbox C",
	"entry.1882059492": "Dropdown B",
	"entry.561368464": "This is finally working!!!!",
	"fvv": 1,
	"draftResponse": [null, null, "-4879680781808958389"],
	"pageHistory": 0,
	"fbzx": -4879680781808958389
}`;

var start = Date.now();

//Beautiful design pattern here.
var semaphore = 0; 
for (var i = 0; i < 10; i++) {
	//Note: We will ask the user to enter their proxy information.
	semaphore++;
	request({
		url: "https://docs.google.com/forms/d/e/1FAIpQLSciNkcZl6T2Tt0ZuFRre-I0hThO5QX8RWAHvaeKC6-FUf67bQ/formResponse",
		method: "POST",
		form: JSON.parse(jsonObj),
		proxy: 'http://jweston:weston160@proxymon:8080', //cannot be https
		ca: certs //cannot be agentOptions: {ca: certs}
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode);
			semaphore--;
			if (semaphore === 0) {
				console.log(`Finished in: ${(Date.now() - start)/1000} seconds`);
			}
		}

	});
}
*/
