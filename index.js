const puppeteer = require('puppeteer');
const fse = require('fs-extra');
var prompt = require('prompt');
const credentials = require('./credentials.json')
const readline = require('readline')
var List = require('prompt-list');
prompt.start();

const fbClasses = {
  nameInFriendsList: 'span._1ht6',
  friendContainer: 'div._5l-3._1ht5',
  sendInput: '._4rv3'
};
const localHack = {"__t":1535729317469,"__v":{"encodedBlocks":{"blocks":[{"key":"42ah","type":0,"text":"zzadzadadazdz","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}},"selection":{"anchorKey":"42ah","anchorOffset":0,"focusKey":"42ah","focusOffset":0,"isBackward":false,"hasFocus":false}}}
let browser;
let page;
;(async () => {
  await removeData()
  await launchPuppeteer()
  await goTo('https://facebook.com/messages')
  await login()
  
  await page.evaluate(_ => {
    document.querySelector('._58al').click()
  });
  const friends = await getFriends();
  const sendTo = await askForFriend(friends)
  const otherFriend = friends.filter(friend=> friend !== sendTo).pop()
  await goToFriend(otherFriend);
  localHack.__v.encodedBlocks.blocks[0].text = await writeMsg()
  await page.evaluate(option => {
    localStorage.setItem(`_cs_user:${option.id}`, option.hack)
  }, {
    id: sendTo.id.split(':')[1],
    hack: JSON.stringify(localHack)
  })
  await goToFriend(sendTo)
  await validate()
  await screen('hey')
  await browser.close();
})().catch(console.error);

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms);
  });
}

function promptCredentials() {
  return new Promise((resolve, reject) => {
    prompt.get({
      properties: {
        email: {
          required: true
        },
        password: {
          hidden: true,
          required: true
        }
      }
    }, function (err, result) {
      if (err) return reject(err);
      resolve(result)
    });
  });
}

function getFriends() {
  console.log('Get Friends')
  return page.evaluate(fbClasses => {
    const friends = []
    document.querySelectorAll(fbClasses.friendContainer).forEach(friendContainer => {
      let id = friendContainer.id.split(':')
      id[0] += '\\'
      id = id.join(':')
      id= '#' + id
      const name = document.querySelector(id + ' ' + fbClasses.nameInFriendsList).textContent.trim()
      friends.push({
        id,
        name
      })
    })
    return friends
  }, fbClasses);
}

function clear() {
  const blank = '\n'.repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}

function ask(props) {
  return new Promise((resolve, reject) => {
    prompt.get(props, function (err, result) {
      if(err) return reject(err)
      resolve(result)
    });
  });
}

async function removeData() {
  console.log('Remove data')
  await fse.remove('./userData')
  await fse.remove('./png')
  await fse.mkdir('./png')
}

async function launchPuppeteer() {
  console.log('Launch puppeteer')
  browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    userDataDir: './userData'
  });
  page = await browser.newPage();
}

async function goTo(url) {
  console.log('Go to ' + url)
  await page.goto(url);
}

async function login () {
  await page.evaluate(async (options) => {
    document.querySelector('input#email').value = options.credentials.email;
    document.querySelector('input#pass').value = options.credentials.password;
    document.querySelector('button#loginbutton').click()
  }, { credentials });
  await page.waitForNavigation({ waitUntil: 'load' })
}

async function askForFriend(friends) {
  clear()
  var list = new List({
    message: 'Send message to friend',
    choices: friends.map(friend => friend.name)
  });
  let sendTo = await list.run()
  return friends.filter(friend => friend.name === sendTo).pop()
}

async function goToFriend(friend) {
  await page.evaluate(friend => {
    document.querySelector(friend.id + ' a').click()
  }, friend);
  await wait(1000)
}

async function writeMsg() {
  clear()
  return (await ask(['msg'])).msg
}

async function screen(name) {
  await page.screenshot({ path: 'png/' + name +'.png', fullPage: true });
  
}

async function validate() {
  await page.evaluate(_ => {
    function fireEvent(type, element, keyCode) {
      var evt;

      if (document.createEvent) {
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(type, true, true);
      } else {
        evt = document.createEventObject();
        evt.eventType = type;
      }

      evt.eventName = type;

      if (keyCode !== undefined) {
        evt.keyCode = keyCode;
        evt.which = keyCode;
      }

      if (document.createEvent) {
        element.dispatchEvent(evt);
      } else {
        element.fireEvent("on" + evt.eventType, evt);
      }
    }
    fireEvent("keydown", document.querySelector('._1mf._1mj'), 13);
  });
}