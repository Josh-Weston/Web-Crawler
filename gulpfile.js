const gulp = require('gulp');

//Create an electron-connect server to enable reloading.
//Clients have been created in init.js. Both clients will reload on change.
const electron = require('electron-connect').server.create();

//Restart on package changes, reload on application changes.
gulp.task('default', () => {
   
    electron.start();
    gulp.watch(['./*.*'], electron.restart);
    gulp.watch(['./app/index.html'], electron.reload);
    gulp.watch(['./app/css/*.css'], electron.reload);
    gulp.watch(['./app/js/classes/*.js'], electron.reload); //don't want it watching libraries.

}); //Default task.