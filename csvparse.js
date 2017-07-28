//Note: Cognos uses utf16le encoding with tab delimiters not comma.

//The first 8 are all the same, and the 9th is just the line number.
const fs = require('fs'),
	  csv = require('csv'),
	  util = require('util');

//Sync because why not.
var file = fs.readFileSync('C:\\Users\\jweston\\Documents\\GitHub\\Web-Crawler\\data\\Probill Details and Line Items.xls', 'utf16le');

csv.parse(file, {delimiter: '\t'}, function(err, data) {
	
	//Make sure we have data to parse
	if (data.length > 1) {
		
		var parseObj = {};
		data[0].forEach((el, index) => {
			if (index < 9) {
				parseObj[el] = data[1][index];
			}
		});
		
		parseObj.lineItems = [];
		
		data.slice(1).forEach((line) => {
			
			parseObj.lineItems.push(new LineItem(line.slice(10)));
			
		});
		
		console.log(parseObj);
		
		//fs.writeFileSync('C:\\users\\jweston\\Desktop\\lines.txt', util.inspect(parseObj));
		
	}
	
});


/*
Constructor pattern
	el[0] = pcs
	el[1] = desc
	el[2] = cls
	el[3] = wgt
	el[4] = amt
	el[5] = code
*/
function LineItem(line) {
	this.pcs = line[0].trim();
	this.desc = line[1].trim();
	this.cls = line[2].trim();
	this.wgt = line[3].trim();
	this.amt = line[4].trim();
	this.code = line[5].trim();
}
	  