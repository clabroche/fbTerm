const blessed = require('./blessed')
const Subject = require('rxjs').Subject
const path = require('path')
const helpers = require('../helpers')
const notifier = require('node-notifier')
const sidebar = {}

const list = blessed.factory.list({
  parent: blessed.layout,
  width: '20%',
  height: '100%',
  border: 'line',
  hidden: true,
  keys: true,
  mouse: true,
  style: {
    border: { fg: 'lightblack' },
    selected: {
      bg: 'white',
      fg: 'black'
    },
  },
});

sidebar.select = new Subject()
sidebar.element = list;

sidebar.render = function (array, prop) {
  list.hidden = false;
  if (this.bak && helpers.equalityObjects(this.bak, array)) return this.select
  
  list.clearItems()
  this.bak = array
  this.prop = prop
  const unread = []
  array.forEach(item => {
    if (item.newMsg) unread.push(item[prop])
    const msg = item.newMsg ? `${item[prop]}`.blue : item[prop]
    list.pushItem(msg)
  })
  if (this.bak && unread.length) {
    notifier.notify({
      icon: path.resolve(__dirname, 'icon.png'),
      title: 'Unread',
      message: 'From: ' + unread.join(',')
    });
  }
  blessed.render()
  return this.select
}

sidebar.destroy = function () {
  list.hidden = true;
  blessed.render()
}

list.on('select', (_, i) => {
  let name = list.items[i].content
  let friend = sidebar.bak.filter(item => item[sidebar.prop] === name || `${item[sidebar.prop]}`.blue === name).pop()
  sidebar.select.next(friend)
})
module.exports = sidebar