#!/usr/bin/env node
require('colors');
const gui = require('./src/gui');
const init = require('./src/gui/init');
const unlock = require('./src/gui/unlock');
const helpers = require('./src/helpers');
const fse = require('fs-extra');
const blessed= require('./src/gui/blessed')
const SimpleCrypto = require("simple-crypto-js").default;
let credentials;
const path = require('path');
(async () => {
  if(!fse.existsSync(path.resolve(path.dirname(require.main.filename), 'credentials.json'))) {
    await promptCredentials()
  } else  {
    credentials = require('./credentials.json')
    let secretKey;
    if(credentials.secret) secretKey = await unlock.render()
    else secretKey = 'Hey'
    const simpleCrypto = new SimpleCrypto(secretKey);
    credentials.password = simpleCrypto.decrypt(credentials.password)
  }
  const fb = require('./src/fb');
  const sidebar = require('./src/gui/sidebar')
  const loading = require('./src/gui/loading')
  const conv = require('./src/gui/conv')
  const loadConv = require('./src/gui/loadConv');
  loading.render('Remove previous session')
  await removeData()
  loading.render('Launch browser')
  await gui.launchPuppeteer()
  loading.render('Go to facebook')
  await gui.goToUrl('https://facebook.com/messages')
  loading.render(`Log in with ${credentials.email} account`)
  await fb.login(credentials)
  loading.render(`Get friends`)
  const friends = await fb.getFriends()
  sidebar.render(friends, 'name')
  sidebar.element.focus()
  blessed.screen.key('C-f', _=>{sidebar.element.focus()})
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
  await fse.remove(path.resolve(path.dirname(require.main.filename), 'userData'))
  await fse.remove(path.resolve(path.dirname(require.main.filename), 'png'))
  await fse.mkdir(path.resolve(path.dirname(require.main.filename), 'png'))
}



function simplePrompt(msg, prop, hidden, required = false) {
  return new Promise((resolve, reject) => {
    const schema = { properties: {} }
    schema.properties[prop || msg] = {
      message: msg,
      required,
      hidden
    }
    prompt.get(schema, (err, result) => {
      if(err)return reject(err)
      resolve(result)
    })
  });
}

async function promptCredentials() {
  return new Promise((resolve, reject) => {
    init.render().subscribe(async ev => {
      const email = ev.email;
      const password = ev.password
      if(ev.keep) {
        const key = ev.secret
        if(key.length) {
          var _secretKey = key;
          var simpleCrypto = new SimpleCrypto(_secretKey);
          await fse.writeJson(path.resolve(path.dirname(require.main.filename), 'credentials.json'), {
            email, password: simpleCrypto.encrypt(password), secret: true 
          })
        } else {
          var _secretKey = 'Hey';
          var simpleCrypto = new SimpleCrypto(_secretKey);
          await fse.writeJson(path.resolve(path.dirname(require.main.filename), 'credentials.json'), {
            email, password: simpleCrypto.encrypt(password), secret: false 
          })
        }
      }
      credentials = { email, password }
      resolve(credentials)
    })
  });
}