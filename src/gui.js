const puppeteer = require('puppeteer');
const path = require('path')
const gui = {}

gui.launchPuppeteer = async function() {
    this.browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        userDataDir: path.resolve(__dirname, 'userData')
    });
    this.page = await this.browser.newPage();
}

gui.setTitle = function() {
    this.clearLine(0)
    this.clearLine(1)
    for (let x = 0; x < this.wxdth(); x++) {
        this.writeTo(i, 1, '─')
    }
}

gui.goToUrl = async function (url) {
    await this.page.goto(url);
}

gui.screen = async function (name) {
  await this.page.screenshot({ path: path.resolve(__dirname, 'png', name + '.png'), fullPage: true });
}

gui.close = function () {
    return this.browser.close();
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
module.exports = gui