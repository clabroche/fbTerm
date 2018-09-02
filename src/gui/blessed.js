var blessed = require('blessed');
const _blessed = {}
_blessed.factory = blessed;
_blessed.screen = blessed.screen({
    smartCSR: true
});
_blessed.layout = blessed.box({
    parent: _blessed.screen,
    width:'100%',
    height:'100%',
})
_blessed.screen.title = 'my window title';
_blessed.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});
_blessed.screen.key(['S-tab'], function (ch, key) {
    return _blessed.screen.focusNext()
});
_blessed.screen.key(['tab'], function (ch, key) {
    return _blessed.screen.focusPrevious()
});
_blessed.screen.render();
_blessed.elements = []
_blessed.register = function (gui) {
    _blessed.screen.append(list);
}
_blessed.unregister = function (gui) {
    _blessed.screen.remove(list);
}
_blessed.render = function() {
    _blessed.screen.render()
}

module.exports = _blessed