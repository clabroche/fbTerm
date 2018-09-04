const blessed = require('./blessed')
const Subject = require('rxjs').Subject
const fb = require('../fb')

const conv = {}
const box = blessed.factory.box({
  parent: blessed.layout,
  top: 3,
  left: '20%',
  height: '100%-6',
  width: '80%',
  hidden: true,
  scrollable: true,
  mouse: true,
  border: 'line',
  style: {
    border: { fg: 'lightblack' },
    selected: {
      bg: 'white',
      fg: 'black'
    },
  },
  scrollbar: {
    style: { bg: 'blue' }
  },
});

var form = blessed.factory.form({
  parent: blessed.layout,
  top: '100%-3',
  left: '20%',
  width: '80%',
  height: 3,
  keys: true,
  hidden: true,
  style: {
    border: { fg: 'lightblack' },
    focus: {
      border: {
        type: 'line',
        fg: 'white'
      }
    }
  },
});

var input = blessed.factory.textbox({
  parent: form,
  width: '100%',
  mouse: true,
  keys: true,
  shrink: true,
  input: true,
  border: 'line',
  style: {
    border: { fg: 'lightblack' },
    focus: {
      border: {
        type: 'line',
        fg: 'white'
      }
    }
  },
});

var title = blessed.factory.textbox({
  parent: blessed.layout,
  width: '80%',
  left: '20%',
  top:0,
  height: 3,
  hidden: true,
  align: "center",
  border: 'line',
  style: {
    border: { fg: 'lightblack' },
  },
});

conv.render = function (convs, friend) {
  this.friend = friend
  this.convs = convs
  box.hidden = false
  input.hidden = false
  form.hidden = false
  title.hidden = false
  title.content = friend.name
  box.content = ''
  box.getLines().map(_box=>box.clearLine(0))
  let i = 0;
  convs.map((conv) => {
    box.insertLine(i, `${conv.who}: `.underline.blue + conv.body)
    box.insertLine(i+1, ' ')
    i+=2
  })
  box.scrollTo(box.getLines().length + 1)
  blessed.render()
}

conv.destroy = function (convs) {
  box.hidden = true
  input.hidden = true
  title.hidden = true
  box.content = ''
  blessed.render()
}

conv.submit = new Subject();

form.on('submit', async ev => {
  input.content = 'Send Message'
  await fb.sendMsg(ev.textbox, conv.friend)
  input.content = ''
  input.value = ''
})

input.key(['enter'], function () {
  form.submit();
});

module.exports = conv