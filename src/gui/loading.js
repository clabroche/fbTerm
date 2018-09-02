const blessed = require('./blessed')
const Subject = require('rxjs').Subject
const fb = require('../fb')
const loading = {}
const box = blessed.factory.box({
    parent: blessed.layout,
    height: '100%',
    width: '100%',
    border: 'line',
    keys: true,
    hidden: true,
    mouse: true,
})
const subtitle = blessed.factory.box({
    parent: box,
    style: {
        selected: {
            bg: 'white',
            fg: 'black'
        }
    },
    top:'100%-3',
    keys: true,
    mouse: true,
});
const title = blessed.factory.box({
    parent: box,
    left: "center",
    top: 'center', 
    align: "center",
    valign:"middle",
    height:1,
    width: 'Welcome to fbTerm'.length,
    content: 'Welcome to fbTerm',
    style: {
        selected: {
            bg: 'white',
            fg: 'black'
        }
    },
    keys: true,
    mouse: true,
});
loading.render = function (text) {
    subtitle.content = text
    box.hidden = false
    blessed.screen.render()
}
loading.destroy = function () {
    subtitle.content = ''
    box.hidden = true
    blessed.screen.render()
}
this.select = new Subject()
module.exports = loading
