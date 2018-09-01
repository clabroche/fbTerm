const gui = require('./gui')
const helpers = require('./helpers')
const credentials = require('../credentials.json')
const fbClasses = require('./fbClasses')

const fb = {}

fb.login = async function () {
  gui.screen('lkj')
  await gui.page.evaluate(async (credentials) => {
    document.querySelector('input#email').value = credentials.email;
    document.querySelector('input#pass').value = credentials.password;
    document.querySelector('button#loginbutton').click()
  }, credentials);
  await gui.page.waitForNavigation({
    waitUntil: 'load'
  })
}

fb.sendMsg = async function () {
  await gui.page.evaluate(_ => { document.querySelector('._58al').click() });
  const friends = await this.getFriends();
  const sendTo = await this.askForFriend(friends)
  const otherFriend = friends.filter(friend => friend !== sendTo).pop()
  await this.goToFriend(otherFriend);
  fbClasses.msgLocalStorage.
    __v.encodedBlocks.blocks[0].text = await this.writeMsg(true)
  await gui.page.evaluate(option => {
    localStorage.setItem(`_cs_user:${option.id}`, option.hack)
  }, {
    id: sendTo.id.split(':')[1],
    hack: JSON.stringify(fbClasses.msgLocalStorage)
  })
  await this.goToFriend(sendTo)
  await this.validate()
}

fb.askForFriend = async function() {
  const friends = await this.getFriends()
  return gui.choices('Send message to friend', friends, 'name')
}

fb.writeMsg = async function () {
  gui.clear()
  return (await gui.ask({
    properties: {
      msg: {
        message: 'Message to send',
        required: true
      }
    }
  })).msg
}

fb.validate = async function () {
  await gui.page.evaluate(_ => {
    function fireEvent(type, element, keyCode) {
      let evt;
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
      if (document.createEvent) element.dispatchEvent(evt)
      else element.fireEvent("on" + evt.eventType, evt);
    }
    fireEvent("keydown", document.querySelector('._1mf._1mj'), 13);
  });
}

fb.goToFriend = async function (friend) {
  await gui.page.evaluate(friend => {
    document.querySelector(friend.id + ' a').click()
  }, friend);
  await helpers.wait(1000)
}

fb.getFriends = async function() {
  return gui.page.evaluate(fbClasses => {
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


module.exports = fb