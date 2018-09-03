const blessed = require('./blessed')
const Subject = require('rxjs').Subject
const fb = require('../fb')
const loadConv = require('./loadConv')
const conv = {}
const box = blessed.factory.box({
  parent: blessed.layout,
  left: '20%',
  width: '80%',
  top: 3,
  hidden: true,
  height: '100%-6',
  border: 'line',
  scrollable: true,
  mouse: true,
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
  style: {
    border: {
      fg: 'lightblack'
    },
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
  mouse: true,
  keys: true,
  shrink: true,
  input: true,
  width: '100%',
  inputOnFocus: true,
  style: {
    border: {
      fg: 'lightblack'
    },
    focus: {
      border: {
        type: 'line',
        fg: 'white'
      }
    }
  },
  border: 'line',
});
var title = blessed.factory.textbox({
  parent: blessed.layout,
  width: '80%',
  left: '20%',
  height: 3,
  align: "center",
  top:0,
  hidden: true,
  style: {
    border: { fg: 'lightblack' },
  },
  border: 'line',
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
  for (let i = 0; i < box.getLines(); i++) {
    box.clearLine(0)
  }
  convs.map((conv, i) => {
    box.insertLine(i, conv.who + ': ' + conv.body)
  })
  input.focus()
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