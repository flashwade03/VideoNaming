const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const url = require('url');

let mainWindow;

function setMainMenu() {
  const template = [
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Open Dev Tool',
          click() {
            mainWindow.webContents.openDevTools();
            console.log(app.getAppPath());

            const options = {
              detail: path.resolve(app.getAppPath(), '../../../'),
            };
            dialog.showMessageBox(
              null,
              options,
              (response, checkboxChecked) => {
                console.log(response);
              },
            );
          },
        },
        {
          label: 'Save Data To File',
          click() {
            mainWindow.webContents
              .executeJavaScript('localStorage.getItem("storedData");', true)
              .then((result) => {
                try {
                  fs.writeFileSync(
                    path.resolve(app.getAppPath(), '../../../data_config.json'),
                    result,
                  );
                } catch (e) {
                  dialog.showOpenDialog(() => {
                    console.log('파일 저장에 실패했습니다.');
                  });
                }
              });
          },
        },
        {
          label: 'Terminate',
          click() {
            app.quit();
          },
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 660,
    webPreferences: { nodeIntegration: true },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    const startUrl =
      process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file',
        slashes: true,
      });
    mainWindow.loadURL(startUrl);
  }
}

ipcMain.on('changeSingleFile', (event, ...args) => {
  console.log(args);
  fs.rename(args[1], args[1].replace(args[0], args[2]), (err) => {
    if (err) {
      throw err;
    }
    const options = {
      detail: '파일 이름 변경이 완료되었습니다.',
    };
    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      console.log(response);
    });
  });
});

ipcMain.on('changeMultipleFiles', (event, arg) => {
  console.log(arg);
  const data = JSON.parse(arg);
  console.log(data);
  data.videos.map((video) => {
    if (video.check && video.newfilename !== null) {
      fs.rename(
        video.filepath,
        video.filepath.replace(video.filename, `${video.newfilename}.mp4`),
        (err) => {
          if (err) {
            throw err;
          }
          console.log('rename complete!');
        },
      );
    }
  });

  const options = {
    detail: '파일 이름 변경이 완료되었습니다.',
  };
  dialog.showMessageBox(null, options, (response, checkboxChecked) => {
    console.log(response);
  });
});

ipcMain.on('testCommand', (event, ...args) => {
  console.log(args);
});

ipcMain.on('loadDataSet', (event, ...args) => {
  console.log(args);
  let configFilePath;
  if (isDev) {
    configFilePath = path.resolve(app.getAppPath(), 'public/data_config.json');
  } else {
    configFilePath = path.resolve(
      app.getAppPath(),
      '../../../data_config.json',
    );
  }

  const rawdata = fs.readFileSync(configFilePath);
  const data = JSON.parse(rawdata);
  const dataStr = JSON.stringify(data);

  event.sender.send('finish-load-data', data);
});

ipcMain.on('saveDataSet', (event, configData) => {
  try {
    let configFilePath;

    if (isDev) {
      configFilePath = path.resolve(
        app.getAppPath(),
        'public/data_config.json',
      );
    } else {
      configFilePath = path.resolve(
        app.getAppPath(),
        '../../../data_config.json',
      );
    }
    fs.writeFileSync(configFilePath, configData);
    const options = {
      detail: '설정 파일 저장을 완료했습니다.',
    };
    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      console.log(response);
    });
  } catch (e) {
    const options = {
      detail: '설정 파일 저장에 실패했습니다.',
    };
    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      console.log(response);
    });
    console.log(e);
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on('active', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  setMainMenu();
});

app.on('window-all-closed', () => {
  app.quit();
});
