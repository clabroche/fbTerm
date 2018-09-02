const blessed = require('./blessed')
const Subject = require('rxjs').Subject
const fb = require('../fb')
const loading = {}
const box = blessed.factory.box({
    parent: blessed.layout,
    left: '20%',
    height: '100%',
    width: '80%',
    border: 'line',
    keys: true,
    hidden: true,
    mouse: true,
})

loading.render = function (text) {
    box.hidden = false
    box.content = text || 'Loading...'
    blessed.screen.render()
}
loading.destroy = function () {
    box.hidden = true
    blessed.screen.render()
}
this.select = new Subject()
module.exports = loading
