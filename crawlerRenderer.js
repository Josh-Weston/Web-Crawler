//Use $$ to avoid conflicts. This is loaded first, so
//native scripts could override it.
window.$$ = require('./app/js/libs/jquery-3.2.1.min');
const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.send('ready');

ipcRenderer.on('query-string', (event, arg) => {
    
    
    console.log(arg);
    var e = $$.Event('keydown');
    e.which = 13;
    e.keyCode = 13;
    
    //This is all working, but not as easy as expected.
    
    /*
    $$('#lst-ib').keydown(function(e) {
        console.log('yes, this was fired');
        console.log(e.which);
    });
    

    
    $$('#lst-ib').val(arg).trigger(e);
    */
    
    //Yep, this works. When in doubt. Find the form submit */
    $$('#lst-ib').val(arg);
    $$('#tsf').submit();
    
});
