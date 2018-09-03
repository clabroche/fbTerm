const blessed = require('./blessed')
const Subject = require('rxjs').Subject

const init = {}

var form = blessed.factory.form({
  parent: blessed.layout,
  width: '100%',
  height: '100%',
  keys: true,
  border: 'line',
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

var email = blessed.factory.textbox({
  parent: form,
  width: '100%-2',
  mouse: true,
  keys: true,
  shrink: true,
  input: true,
  label: 'Email',
  inputOnFocus: true,
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
var password = blessed.factory.textbox({
  parent: form,
  width: '100%-2',
  top: 3,
  mouse: true,
  keys: true,
  shrink: true,
  input: true,
  hidden: false,
  label: 'Password',
  inputOnFocus: true,
  censor: true,
  content: "lkjfr",
  border: 'line',
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
var keep = blessed.factory.checkbox({
  parent: form,
  width: '100%-2',
  top: 6,
  mouse: true,
  keys: true,
  shrink: true,
  input: true,
  hidden: false,
  content: 'Password',
  inputOnFocus: true,
  censor: true,
  content: "Keep configuration",
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
var secret = blessed.factory.textbox({
  parent: form,
  width: '100%-2',
  top: 8,
  mouse: true,
  keys: true,
  shrink: true,
  input: true,
  // hidden: true,
  label: 'Secret (Empty => No secret)',
  inputOnFocus: true,
  content: "Keep configuration",
  border: "line",
  censor: true,
  hidden: true,
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

init.render = function () {
  form.hidden = false
  blessed.render()
  return init.submit
}

init.destroy = function (inits) {
  form.hidden = true
  blessed.render()
}

init.submit = new Subject();


email.key(['enter'], _ => form.submit())
password.key(['enter'], _ => form.submit())
secret.key(['enter'], _=> form.submit())

keep.on('check', _ => {
  secret.hidden = false
  blessed.render()
})
keep.on('uncheck', _ => {
  secret.hidden = true
  blessed.render()
})
form.on('submit', ev=>{
  if(!email.getValue() || !password.getValue()) return
  else init.submit.next({
    email: email.getValue(),
    password: password.getValue(),
    keep: keep.checked,
    secret: secret.getValue()
  })
})
module.exports = init