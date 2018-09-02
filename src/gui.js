const getCursorPosition = require('get-cursor-position');
const puppeteer = require('puppeteer');
const readline = require('readline')
var List = require('prompt-list');
var prompt = require('prompt');

const gui = {}
prompt.start();

gui.launchPuppeteer = async function() {
    this.browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        userDataDir: './userData'
    });
    this.page = await this.browser.newPage();
}

gui.clear = function () {
    const blank = '\n'.repeat(process.stdout.rows)
    (blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
}

gui.setTitle = function() {
    this.clearLine(0)
    this.clearLine(1)
    for (let x = 0; x < this.wxdth(); x++) {
        this.writeTo(i, 1, '─')
    }
}

gui.clearLine = function (lineNumber) {
    readline.cursorTo(process.stdout, 0, lineNumber)
    readline.clearLine(process.stdout)
}

gui.goToUrl = async function (url) {
    await this.page.goto(url);
}

gui.screen = async function (name) {
  await this.page.screenshot({ path: 'png/' + name +'.png', fullPage: true });
  
}

gui.choices = async function (msg, list, property) {
    this.clear()
    var choices = new List({
        message: msg,
        choices: list.map(item => property ? item[property] : item)
    });
    let result = await choices.run()

    return property ? list.filter(item => item[property] === result).pop() : result
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

gui.writeCenter = function (msg) {
    const width = process.stdout.columns;
    const height = process.stdout.rows;
    msg = msg.split('\n')
    this.clear()
    let y = Math.floor(height / 2) - Math.floor(msg.length / 2)
    msg.map(line => {
        const x = Math.floor(width / 2) - Math.floor(line.length / 2)
        this.writeTo(x, y, line)
        y++
    })
    this.goTo(width, height)
}

gui.writeTo = function (x, y, msg, clear) {
    if(clear) this.clearLine(y)
    this.goTo(x, y)
    process.stdout.write(msg)
}

gui.goTo = function(x,y) {
    readline.cursorTo(process.stdout, x, y)
}

gui.spinner = function (x=0,y=0) {
    const spinnerPattern = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    let i = 0
    return setInterval(() => {
        this.writeTo(0, 0, ' ' + spinnerPattern[i] + ' ')
        if (i === spinnerPattern.length - 1) i = 0
        else i++
    }, 100);
}

gui.getCursorPosition = function() {
    return new Promise((resolve, reject) => {
        getCursorPosition.async(function (pos) {
            return resolve(pos)
        });
    });
}

gui.height = () => process.stdout.rows
gui.width = () => process.stdout.columns


gui.home = async function() {
    return this.choices('What ?', [
        {id:1, description: 'Send Message to a friend'},
        {id:2, description: 'View unread (not implemented)'},
        {id:3, description: 'View messages of friend (not implemented)'},
    ], 'description')

}
module.exports = gui