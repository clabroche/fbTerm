const puppeteer = require('puppeteer');
var prompt = require('prompt');
var List = require('prompt-list');
const readline = require('readline')
const gui = {}
prompt.start();

gui.launchPuppeteer = async function() {
    console.log('Launch puppeteer')
    this.browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        userDataDir: './userData'
    });
    this.page = await this.browser.newPage();
}

gui.clear = function() {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
}

gui.goTo = async function (url) {
    console.log('Go to ' + url)
    await this.page.goto(url);
}

gui.screen = async function (name) {
  await this.page.screenshot({ path: 'png/' + name +'.png', fullPage: true });
  
}

gui.choices = async function (msg, list, property) {
    this.clear()
    var choices = new List({
        message: msg,
        choices: list.map(item => item[property])
    });
    let sendTo = await choices.run()
    return list.filter(item => item[property] === sendTo).pop()
}

gui.ask = function (props) {
  return new Promise((resolve, reject) => {
    prompt.get(props, function (err, result) {
      if(err) return reject(err)
      resolve(result)
    });
  });
}

gui.close = function () {
    return this.browser.close();
}

gui.writeMsg = async function () {
    this.clear()
    return (await this.ask(['msg'])).msg
}


module.exports = gui