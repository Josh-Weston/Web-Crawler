/**
* Engine ensures instructions are performed sequentially and properly.
* @class InstructionEngine
* @constructor
*/

var request = require('request');


//TODO: This should produce a log file that shows the audit's performance and how each record performed.
class AuditEngine {
    
    //Receives an array of instructions to perform.
    constructor(auditFile) {
        this.auditFile = auditFile;

    }
    
    startAudit() {
        
        var fieldMap = this.buildFieldMap();
        console.log(fieldMap);
    }
    
    //Function maps data fields to their index in the array.
    buildFieldMap() {
        
        //For some reason, auditFile.dataFields is only showing 3 entries.
        var fieldMap = {};
        console.log(this.auditFile.dataFields);
        for (let dataFieldObj of this.auditFile.dataFields) {
            fieldMap[dataFieldObj.dataField] = this.auditFile.data[0].indexOf(dataFieldObj.dataField);
        }
        
        return fieldMap;
        
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

module.exports = AuditEngine;

//Note: Engine needs to be at the Node level to ensure we can interact with files and save logs.