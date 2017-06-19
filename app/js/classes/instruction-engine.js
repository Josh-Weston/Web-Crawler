/**
* Engine ensures instructions are performed sequentially and properly.
* @class InstructionEngine
* @constructor
*/
class InstructionEngine () {
    
    //Receives an array of instructions to perform.
    constructor(instructions) {
        this.instructions = instructions;
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
    
    
    
} //End class InstructionEngine.