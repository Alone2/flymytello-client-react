// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
// const { ipcMain } = require("electron")
const path = require("path");
const fs = require("fs");

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 960,
        resizable: true,
        show: true,
        // frame: false,
        webPreferences: {
            nodeIntegration: true,
        },
        icon: path.join(__dirname, "assets/icons/flymytello50x50.png"),
    });
    mainWindow.removeMenu();

    mainWindow.loadFile("build/index.html");

    // DEBUG Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

// DEBUG
// app.commandLine.appendSwitch("ignore-certificate-errors", "true");

app.allowRendererProcessReuse = true;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.use(express.static(path.join(__dirname, "public")));
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
exports.openWindow = function (filename) {
    let win = new BrowserWindow({
        width: 1000,
        height: 750,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
        icon: path.join(__dirname, "assets/icons/flymytello50x50.png"),
    });
    win.removeMenu();
    // win.webContents.openDevTools();
    win.loadFile(filename);
    return win;
};

exports.ConfigFile = class {
    constructor() {
        this.path = path.join(app.getPath("userData"), "config.json");
    }
    read() {
        var out;
        try {
            out = JSON.parse(fs.readFileSync(this.path));
        } catch (error) {
            out = { clickClosech: false };
        }
        return out;
    }
    save(inp) {
        // console.log(inp);
        const store = JSON.stringify(inp);
        fs.writeFileSync(this.path, store);
        return true;
    }
    get(key) {
        const r = this.read();
        return r[key];
    }
    put(key, value) {
        var r = this.read();
        r[key] = value;
        this.save(r);
    }
};
