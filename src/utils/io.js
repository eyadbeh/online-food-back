let _io = null;

function init(io) {
  _io = io;
}

function getIO() {
  return _io;
}

module.exports = { init, getIO };
