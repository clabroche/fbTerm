require('colors');
const gui = require('./src/gui');
const helpers = require('./src/helpers');
const fse = require('fs-extra');
const fb = require('./src/fb');
const credentials = require('./credentials.json');
const sidebar = require('./src/gui/sidebar')
const loading = require('./src/gui/loading')
const conv = require('./src/gui/conv')
const loadConv = require('./src/gui/loadConv');

(async () => {
  loading.render('Remove previous session')
  await removeData()
  loading.render('Launch browser')
  await gui.launchPuppeteer()
  loading.render('Go to facebook')
  await gui.goToUrl('https://facebook.com/messages')
  loading.render(`Log in with ${credentials.email} account`)
  await fb.login()
  loading.render(`Get friends`)
  setInterval(async _=>{
    const friends = await fb.getFriends()
    sidebar.render(friends, 'name')
  }, 1000)
  let currentFriend;
  sidebar.select.subscribe(async friend=>{
    conv.destroy()
    loadConv.render()
    currentFriend = friend
  })
  let lock = false;
  setInterval(async _=>{
    if(lock) return
    else lock = true
    if(!currentFriend) return lock = false; 
    const convs = await fb.getFriend(currentFriend)
    if (conv.convs && helpers.equalityObjects(conv.convs, convs))return  lock = false
    conv.destroy()
    loadConv.destroy()
    conv.render(convs, currentFriend)
    lock = false
  },1000)
  loading.destroy()
  
})().catch(console.error);


async function removeData() {
  await fse.remove('./userData')
  await fse.remove('./png')
  await fse.mkdir('./png')
}



