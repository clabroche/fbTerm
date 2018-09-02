const blessed = require('./blessed')
const Subject = require('rxjs').Subject
const fb = require('../fb')
const loadConv = require('./loadConv')
const conv = {}
const box = blessed.factory.box({
    parent: blessed.layout,
    left: '20%',
    width: '80%',
    hidden: true,
    height: '100%-3',
    border: 'line',
    scrollable: true,
    mouse: true,
    style: {
        border: {
            fg: 'white'
        },
        selected: {
            bg: 'white',
            fg: 'black'
        }
    },
    scrollbar: {
        style: {
            bg: 'yellow'
        }
    },
});
var form = blessed.factory.form({
    parent: blessed.layout,
    keys: true,
    left: '20%',
    width: '80%',
    hidden: true,
    top: '100%-3',
    height: 3,
    bg: 'white',
    border: 'line',
});

var input = blessed.factory.textbox({
    parent: form,
    mouse: true,
    keys: true,
    shrink: true,
    input: true,
    width:'100%',
    inputOnFocus: true
});
conv.render = function (convs, friend) {
    this.friend = friend
    this.convs = convs
    box.hidden = false
    input.hidden = false
    form.hidden = false
    box.content= ''
    for (let i = 0; i < box.getLines(); i++) {
        box.clearLine(0)
    }
    convs.map((conv, i) => {
        box.insertLine(i, conv.who + ': ' + conv.body)
    })
    input.focus()
    box.scrollTo(box.getLines().length)
    blessed.render()
}
conv.destroy = function (convs) {
    box.hidden = true
    input.hidden = true
    box.content = ''
    blessed.render()
}
conv.submit = new Subject();
form.on('submit', async ev=>{
    conv.destroy()
    loadConv.render('Send Message')
    await fb.sendMsg(ev.textbox, conv.friend)
    input.value = ''
    loadConv.render('Refresh')
    setTimeout(async () => {
        const friends = await fb.getFriend(conv.friend)
        loadConv.destroy()
        conv.render(friends, conv.friend)
    }, 100);
})
input.key(['enter'], function () {
    form.submit();
});
module.exports = conv
