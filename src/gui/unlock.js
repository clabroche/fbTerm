const blessed = require('./blessed')
const Subject = require('rxjs').Subject

const unlock = {}

var form = blessed.factory.form({
  parent: blessed.layout,
  width: '100%',
  height: '100%',
  keys: true,
  border: 'line',
  hidden: true,
  focusable: false,
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

var secret = blessed.factory.textbox({
  parent: form,
  width: '100%-6',
  top: "center",
  left: "center",
  mouse: true,
  keys: true,
  shrink: true,
  input: true,
  focused: true,
  label: 'Secret',
  inputOnFocus: true,
  content: "Keep configuration",
  border: "line",
  censor: true,
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

unlock.render = function () {
  return new Promise((resolve, reject) => {
    form.hidden = false
    secret.key('enter', ev=>{
      form.hidden = true
      resolve(secret.getValue())
      blessed.render()
    })
    blessed.render()
  });
}

unlock.destroy = function (unlocks) {
  form.hidden = true
  blessed.render()
}

unlock.submit = new Subject();


module.exports = unlock