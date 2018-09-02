const blessed = require('./blessed')
const home = {}

home.element = blessed.factory.list({
    parent: blessed.layout,
    tags: true,
    border: 'line',
    style: {
        fg: 'white',
        bg: 'red',
        border: {
            fg: '#f0f0f0'
        },
    },
    items: [
        'hey',
        'Ho',
    ],
    keys: true,
    mouse: true,
})
module.exports = home
