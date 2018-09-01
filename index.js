const fs = require('fs');
const gui = require('./src/gui');
const helpers = require('./src/helpers');
const fse = require('fs-extra');
const fb = require('./src/fb');
const credentials = require('./credentials.json');
const ioHook = require('iohook');

(async () => {
  router()
  gui.clear()
  const spinner = gui.spinner(0,0)
  gui.writeCenter('Welcome to fbTerm')
  gui.writeTo(0, gui.height(), 'Remove previous data', true)
  // gui.writeTo(3, 0, 'Press shift+h for help', true)
  await removeData()
  
  gui.writeTo(0, gui.height(), 'Launch browser in background', true)
  await gui.launchPuppeteer()
  gui.writeTo(0, gui.height(), 'Go to facebook', true)
  await gui.goToUrl('https://facebook.com/messages')
  gui.writeTo(0, gui.height(), `Log in with ${credentials.email} account`, true)
  await fb.login()
  clearInterval(spinner)
  gui.clear()
  router()
  await home()
})().catch(console.error);

async function home() {
  gui.clear()
  helpers.wait(1000)
  const result = await gui.home();
  if (result.id === 1) await fb.sendMsg()
}
function router() {
  // ctrl+m => send message to
  ioHook.on('keydown', event => {
    if (event.ctrlKey) {
      if(event.keycode === 46) {  // ctrl+c
        process.kill(process.pid, 'SIGKILL')
      }
    }
  });


  // Register and start hook
  ioHook.start();
}


async function removeData() {
  // gui.writeCenter('Remove data')
  await fse.remove('./userData')
  await fse.remove('./png')
  await fse.mkdir('./png')
}



