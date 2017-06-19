//This class holds the instructions and checks to perform the audit.
//This is the entry point class for performing the audit.
class Audit {
    
    //The constructor receives the JSON, which contains all information to instantiate/initialize the object.
    constructor(fileJSON) {
        this.name = fileJSON.name;
        this.instructions = fileJSON.instructions;
    }
    
    //User can manually add an instruction to the stack and resave the file.
    addInstruction(instr) {
        this.instructions.push(instr);
    }
    
    speak() {
        console.log(this.name);
        console.log(this.instructions);
    }
}

module.exports = Audit;