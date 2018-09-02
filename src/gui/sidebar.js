const blessed = require('./blessed')
const Subject = require('rxjs').Subject
const fb = require('../fb')
const sidebar = {}
const list = blessed.factory.list({
    parent: blessed.layout,
    width: '20%',
    hidden:true,
    height: '100%',
    bg: 'green',
    border: 'line',
    style: {
        border: {
            fg: 'white'
        },
        selected: {
            bg: 'white',
            fg: 'black'
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
    list.clearItems()
    this.bak = array
    this.prop = prop
    array.map(item=>item[prop]).forEach(item=>list.pushItem(item))
    blessed.render()
    return this.select
}
sidebar.destroy = function () {
    list.hidden = true;
    blessed.render()
}
list.on('select' , (item, i)=>{
    const name = list.items[i].content
    sidebar.select.next(sidebar.bak.filter(item=>item[sidebar.prop] === name).pop())
})
module.exports = sidebar