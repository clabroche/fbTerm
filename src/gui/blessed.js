var blessed = require('blessed');

const _blessed = {}

_blessed.factory = blessed;

_blessed.screen = blessed.screen({ smartCSR: true, height:'100%-3'});
_blessed.screen.title = 'fbTerm';

_blessed.layout = blessed.box({
    parent: _blessed.screen,
    width:'100%',
    height:'100%-4',
})

_blessed.screen.key(['escape', 'q', 'C-c'], _ => process.exit(0))
_blessed.screen.key(['S-tab'], _ => _blessed.screen.focusNext())
_blessed.screen.key(['tab'], _ => _blessed.screen.focusPrevious())

_blessed.render = _=> _blessed.screen.render()

module.exports = _blessed