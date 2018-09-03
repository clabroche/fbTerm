const blessed = require('./blessed')
const Subject = require('rxjs').Subject
const helpers = require('../helpers')
const sidebar = {}
const list = blessed.factory.list({
    parent: blessed.layout,
    width: '20%',
    hidden:true,
    height: '100%',
    border: 'line',
    style: {
        border: {
            fg: 'lightblack'
        },
        selected: {
            bg: 'white',
            fg: 'black'
        },
        focus: {
            border: {
                type: 'line',
                fg: 'white'
            }
        }
    },
    items: [
        'Send message to',
        'lkj'
    ],
    focused: true,
    keys: true,
    mouse: true,
});
sidebar.select = new Subject()
sidebar.render = function (array, prop) {
    list.hidden = false;
    if(this.bak && helpers.equalityObjects(this.bak, array)) return this.select
    list.clearItems()
    this.bak = array
    this.prop = prop
    array.forEach(item=>{
        const msg = item.newMsg ? `New: ${item[prop]}` : item[prop]
        list.pushItem(msg)
    })
    blessed.render()
    return this.select
}
sidebar.destroy = function () {
    list.hidden = true;
    blessed.render()
}
list.on('select' , (item, i)=>{
    let name = list.items[i].content.split('New: ')
    name = name.pop()
    let friend = sidebar.bak.filter(item => item[sidebar.prop] === name).pop()
    sidebar.select.next(friend)
})
module.exports = sidebar
