//Load framework.
const electron = require('electron');
const app = electron.app;

//Initialize the browserWindow objects.
const init = require('./init');

//Create a global instance or it will be garbage collected.
let auditWin, crawlerWin;

/*** Setup Application and Windows***/
//Disable the cache.
app.commandLine.appendSwitch('--disable-http-cache');

app.on('ready', () => {
    ({auditWin, crawlerWin} = init.buildInterface());
});

app.on('window-all-closed', () => {
   //With macOS hitting x doesn't alwasy
   //mean you want to exit the application enitrely.
   if (process.platform !== 'darwin') {
      app.quit();
   }
});

app.on('activate', () => {
   //on Mac, it is common to recreate the window if it is still
   //open in the dock, but no windows are open.
   if (auditWin === null) {
      buildInterface();
   }
 });