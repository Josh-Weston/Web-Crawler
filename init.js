/* Module initializes windows, menus, etc. Returns references to the audit window and the crawler window */
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const dialog = electron.dialog;
const path = require('path');
const client = require('electron-connect').client;
const fs = require('fs');
const csv = require('csv');

class Init {
    
    static buildInterface() {
        
        let auditWin;
        let crawlerWin;
        
        /*** The audit window that loads the package and shows progress ***/
        auditWin = new BrowserWindow({
           maxWidth: 1200,
           maxHeight: 800,
           minHeight: 800,
           minWidth: 800
        });

        auditWin.loadURL(path.join(__dirname, 'app', 'index.html'));

        var appMenu = 
            [{
                label: 'File',
                submenu: [
                  {label: 'Open Audit Package',
                   click() {openAuditPackage(auditWin);}
                  },
                  {label: 'Save Audit Package',
                   click() {console.log('Saving the package');}
                  },
                  {label: 'Open Data File',
                   click() {openDataFile(auditWin);}
                  },
                  {label: 'Show Crawler',
                   click() {crawlerWin.show();}
                  }
                ]
             }];

        Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));
        auditWin.webContents.openDevTools();
        
        /* TODO: build:remove */
        client.create(auditWin);

        /*** The actual BrowserWindow performing the crawl ***/

        //Create the browser window.
        crawlerWin = new BrowserWindow({
            width: 1200, 
            height: 800,
            minWidth: 200,
            minHeight: 200,
            show: false
        });

        //Hide the application's menu.
        crawlerWin.setMenu(null);

        //Preload injects our javascript before the rest of the page's scripts execute.
        //let child = new BrowserWindow({parent: win, width:200, height:200});
        crawlerWin.webContents.openDevTools();

        //TODO: Create a default index.html type splash screen.
        crawlerWin.loadURL('http://www.google.ca');

        //Not sure how reliable this is, but it does seem to work.
        crawlerWin.webContents.on('dom-ready', function() {
            console.log('DOM has finished loading');

            //WARNING: This injection will happen each time the DOM is refreshed.
            var rendererPath = `'${path.join(__dirname, 'crawlerRenderer')}'`;
            crawlerWin.webContents.executeJavaScript(`require(${rendererPath.replace(/\\/g, '\\\\')})`); //escape forward slashes.
        });
        
        //Intercept the default close and simply hide the window.
        crawlerWin.on('close', function(e) {

            e.preventDefault();
            this.hide();

        });

        auditWin.on('closed', () => {
           //TODO: We need to check if the audit is still in process. If so, send a flag somehow.
            crawlerWin.close(); //Need to pass the argument and an event
            auditWin = null;
            crawlerWin = null;
        });
        
        
         //TODO: Remove before production.
        ipcMain.on('ready', (event, msg) => {
            devOpenAuditPackage(auditWin);
        });
        
        ipcMain.on('runAudit', (event, msg) => {
            //msg is passed as an object. We now need to pass this to the audit-engine for processing.
        });
        
        return {auditWin: auditWin, crawlerWin: crawlerWin};

    } //End function buildInterface.
        
} //End class init.

//TODO: Remove before production.
function devOpenAuditPackage(auditWin) {
    var fileNames = ["C:\\Users\\jweston\\Applications\\ElectronCrawler\\app\\gmail.aud"]
    fs.readFile(fileNames[0], (err, data) => {
        if (err) {
            auditWin.webContents.send('main-error', 'Unable to load audit package')
        } else {
            auditWin.webContents.send('audit-file', JSON.parse(data));
        }     
    });
}
/**
* Presents a dialogbox so user can open a previously saved audit package for running.
* @private
* @method openAuditPackage
* @return {Object} description
*/
function openAuditPackage(auditWin) {
    
    //Note: We can also set the default directory.
    dialog.showOpenDialog({filters: [{name: 'Audit Packages', extensions: ['aud']}], properties: ['openFile'], }, function (fileNames) {

        fs.readFile(fileNames[0], (err, data) => {
            if (err) {
                auditWin.webContents.send('main-error', 'Unable to load audit package')
            } else {
                auditWin.webContents.send('audit-file', path.basename(fileNames[0]), JSON.parse(data));
            }     
        });
       
    }); 
    
} //End functon openAuditPackage

/**
* Function allows us to open a data file for input or output. Currently only accepts CSV files.
* @private
* @method openDataFile
* @param {Object} auditWin
* @return {Object} description
*/
function openDataFile(auditWin) {
    
    //Note: We can also set the default directory.
    dialog.showOpenDialog({filters: [{name: 'Data Files', extensions: ['csv']}], properties: ['openFile'], }, function (fileNames) {

        fs.readFile(fileNames[0], (err, data) => {
            if (err) {
                auditWin.webContents.send('main-error', 'Unable to load data file')
            } else {
                //Output is a multidimensional array, with the first elment as the header. Only header is sent to the renderer.
                csv.parse(data, function(err, csvOutput) {
                    auditWin.webContents.send('data-file', {
                        filename: path.basename(fileNames[0]), 
                        head: csvOutput[0],
                        fullpath: fileNames[0],
                        numRecords: csvOutput.length - 1
                    });
                });
            }     
        });
       
    }); 
    
} //End function openDataFile

module.exports = Init;
