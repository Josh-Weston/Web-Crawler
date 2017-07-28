//Avoid collisions by only instantiating once. Note: consts are block scoped.
//When the DOM is wiped, the attached eventlisteners are wiped as well.

if (typeof ipcRenderer === "undefined") {
	var ipcRenderer = require('electron').ipcRenderer;
	
	ipcRenderer.on('landing', (event, arg) => {
		$('body').load("./index.html");
		
		//Reset our JS libraries
		global.ko = undefined;
		
	});
	
}

document.getElementById('btnOpenAudit').addEventListener('click', function(e) {
	userSelect('open');
	$('body').load("./openaudit.html");
});

document.getElementById('btnNewAudit').addEventListener('click', function(e) {
	userSelect('new');
	$('body').load("./newaudit.html");

});

function userSelect(choice) {
	 ipcRenderer.send('user-select', choice);
}