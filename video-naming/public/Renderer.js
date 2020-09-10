const { ipcRenderer } = require('electron');

function changeSingleFile(cmd) {
  const res = ipcRenderer.sendSync('changeSingleFile', cmd);
  return res;
}

function changeMultipleFiles(cmd) {
  const res = ipcRenderer.sendSync('changeMultipleFiles', cmd);
  return res;
}

function testCommand(cmd) {
  const res = ipcRenderer.send('testCommand', cmd);
  return res;
}

function loadDataSet(cmd) {
  const res = ipcRenderer.send('loadDataSet', cmd);
  return res;
}

function saveDataSet(cmd) {
  const res = ipcRenderer.send('saveDataSet', cmd);
  return res;
}
