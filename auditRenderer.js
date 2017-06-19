const ipcRenderer = require('electron').ipcRenderer;

var VM = function() {
    var self = this;
    self.gui = null;
    self.data = ko.observableArray();
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
        ko.utils.arrayPushAll(vm.data, arg); //Convenience function for pushing multiple objects into the array.
    });
    
    //Data file to post against.
    ipcRenderer.on('data-file', (event, arg) => {
       console.log(arg); 
    });

    //Receives error messages occuring from the main process.
    ipcRenderer.on('main-error', (event, arg) => {
        console.log(arg);
    });
    
    ko.applyBindings(vm);
      
});
