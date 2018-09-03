const blessed = require('./blessed')

const loading = {}

const box = blessed.factory.box({
    parent: blessed.layout,
    height: '100%',
    width: '100%',
    border: 'line',
    hidden: true,
})
const subtitle = blessed.factory.box({
    parent: box,
    top:'100%-3',
    style: {
        selected: {
            bg: 'white',
            fg: 'black'
        }
    },
});

loading.titleBox = blessed.factory.box({
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

module.exports = loading
