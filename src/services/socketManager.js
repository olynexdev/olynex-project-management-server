let io;

const setSocketIO = socketIOInstance => {
  io = socketIOInstance;
};

const getSocketIO = () => io;

module.exports = { setSocketIO, getSocketIO };
