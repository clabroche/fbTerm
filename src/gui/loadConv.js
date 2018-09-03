const blessed = require('./blessed')

const loading = {}

const box = blessed.factory.box({
    parent: blessed.layout,
    left: '20%',
    height: '100%',
    width: '80%',
    border: 'line',
    hidden: true,
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

module.exports = loading
