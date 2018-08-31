const fse = require('fs-extra');
const fb = require('./src/fb')
const gui = require('./src/gui')

;(async () => {
  await removeData()
  await gui.launchPuppeteer()
  await gui.goTo('https://facebook.com/messages')
  await fb.login()
  await fb.sendMsg()
  await gui.screen('hey')
  await gui.close()
})().catch(console.error);





async function removeData() {
  console.log('Remove data')
  await fse.remove('./userData')
  await fse.remove('./png')
  await fse.mkdir('./png')
}



