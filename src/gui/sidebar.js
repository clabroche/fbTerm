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
