const ipcRenderer = require('electron').ipcRenderer;

var VM = function() {
    var self = this;
    self.gui = null;
    self.data = ko.observableArray();
    self.auditName = ko.observable();
    self.auditFile = ko.observable(); //auditFile is decorated with binding properties when instantiated.
    self.dataFile = ko.observable();
    self.activeDataFile = ko.observable();
    self.outputFile = ko.observable();
    self.auditReady = ko.observable(false);
    
    self.showDataFile = function(dataObj, event) {
        self.activeDataFile(dataObj);
        $('#dataModal').modal();
    };
    
    //There will only be 1 audit file opened at a time.
    self.showAuditFile = function() {
        $('#auditModal').modal();
    }
    
    //User selects what data file to bind as input.
    self.bindDataFile = function(dataObj, event) {
        self.auditFile().boundDataInput(dataObj);
        self.auditFile().data = self.dataFile().data;
    };
    
    //We receive the calling data field, and the mapped field for binding.
    self.bindDataField = function(auditObj, dataObj, event) {
        
        for (let fieldObj of self.auditFile().boundDataFieldMap()) {
            if (fieldObj.auditField === auditObj) {
                fieldObj.dataField(dataObj);
                break;
            }
        }
        
        self.checkReady();
        
    };
    
    self.checkReady = function() {
        self.auditReady(!self.auditFile().boundDataFieldMap().some(function(el) {
            return el.dataField() === undefined;
        }));
    }
    
    //Function ensures all data has been mapped.
    self.checkDataFieldBindings = function() {
        return self.auditFile().boundDataFieldMap().some((obj) => {
           return obj.dataField === undefined; 
        });
    }
    
    //Function handles user selection for where the output should go.
    self.bindOutput = function(dataObj, event) {
        self.auditFile().boundDataOutput(event.currentTarget.textContent);
    };
    
    //From here, what do we want? Hand-off to the audit engine?
    self.runAudit = function() {
        
        console.log(self.auditFile());
        //Create a package and send it back.
        var auditPackage = {
            dataFields: [],
            staticFields: self.auditFile().instructions[0].staticFields,
            data: self.auditFile().data
        };
                
        for (let dataObj of self.auditFile().boundDataFieldMap()) {
            
            auditPackage.dataFields.push({
                auditField: dataObj.auditField,
                dataField: dataObj.dataField()    
            });
            
        };
        
        ipcRenderer.send('runAudit', auditPackage);
    }
    
}

var GUI = function() {
    var self = this;
    self.vm = null;
}


//Create renderer interface and bindings once DOM is ready.
$(function(){
    
    //Setup VM and GUI.
    var vm = new VM(),
        gui = new GUI();
    
    //Provide references to each other for simplicity.
    vm.gui = gui;
    gui.vm = vm;
    
    //Set-up communication to main process.
    ipcRenderer.on('audit-file', (event, arg) => {
        
        //Apply decorators to audit file
        arg.boundDataInput = ko.observable();
        arg.boundDataOutput = ko.observable();
        arg.boundDataFieldMap = ko.observableArray();
        arg.fullymapped = ko.observable(false);
        
        //Add observableArray for binding data fields.
        for (var i = 0; i < arg.instructions[0].dataFields.length; i++) {
            
            var key = arg.instructions[0].dataFields[i],
                value = ko.observable();
            
            arg.boundDataFieldMap.push({auditField: key, dataField: value})
        }
        
        //Add to viewmodel
        vm.auditName(arg['name']);
        vm.auditFile(arg);
    });
    
    //Data file to post against. We only accept the head and we only accept csv.
    //arg = {filename, head, fullpath}
    ipcRenderer.on('data-file', (event, arg) => {
        vm.dataFile(arg);
    });

    //Receives error messages occuring from the main process.
    ipcRenderer.on('main-error', (event, arg) => {
        console.log(arg);
    });
    
    ko.applyBindings(vm);
    
    /* Signify to main process that the DOM is ready */
    ipcRenderer.send('ready');
      
});
