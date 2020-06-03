const {app, BrowserWindow,globalShortcut} = require('electron')
const path = require('path')
const keyEvents = require('electron-localshortcut');
const screenSize = ()=>require('electron').screen.getPrimaryDisplay().size
const ratio = 1920.0/1080.0
const bigWindowDimensionMultiplier = .8

let mode = 0 //   0 normal,       1 mini,         2 normal full
let miniWindowHeight = 260
let paddingX = 40
let paddingY = 35

let win = null

function update() {

  if(win == null) {
    win = new BrowserWindow({ frame: false })
    win.loadURL('https://youtube.com', {userAgent: 'Chrome'})
    win.setFullScreenable(false)
  }
  const miniWindowWidth = Math.round( ratio*miniWindowHeight)
  const bigWindowWidth = Math.round( screenSize().width*bigWindowDimensionMultiplier)
  const bigWindowHeight = Math.round( screenSize().height*bigWindowDimensionMultiplier)

  if(mode === 1){
    win.setSize(miniWindowWidth,miniWindowHeight,true)
    win.setPosition(screenSize().width-miniWindowWidth-paddingX,screenSize().height-miniWindowHeight-paddingY)
    win.setAlwaysOnTop(true, 'screen')
    win.setSkipTaskbar(true)
    win.focus()
  }
  else if(mode === 0) {
    win.setSize(bigWindowWidth,bigWindowHeight,true)
    win.center()
    win.setAlwaysOnTop(false, 'screen');
    win.setSkipTaskbar(false)
  }
  else if(mode === 2) {
    win.setSize(bigWindowWidth,bigWindowHeight,true)
    win.center()
    win.setAlwaysOnTop(false, 'screen');
    win.setSkipTaskbar(false)
  }
}

app.whenReady().then(() => {
  update()
  globalShortcut.register('F6',() => {
    mode = mode === 1 ? 0 : 1
    update()
  });
  globalShortcut.register('F7',() => {
    mode = mode === 2 ? 0 : 2
    update()
  });
  globalShortcut.register('F4',() => {
    app.quit()
  });

  setInterval(()=>{
        if(mode === 0)win.webContents.executeJavaScript("document.getElementsByClassName('ytp-fullscreen').length == 1").then((fullScreen) =>{
          if(fullScreen) win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'F'})
        })
      },700
  )
  setInterval(()=>{
        if(mode === 1)win.webContents.executeJavaScript("document.getElementsByClassName('ytp-fullscreen').length == 1").then((fullScreen) =>{
          if(!fullScreen) win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'F'})
        })
      },700
  )
  setInterval(()=>{
        if(mode === 2)win.webContents.executeJavaScript("document.getElementsByClassName('ytp-fullscreen').length == 1").then((fullScreen) =>{
          if(!fullScreen) win.webContents.sendInputEvent({type: 'keyDown', keyCode: 'F'})
        })
      },700
  )

  setInterval(()=>{
    win.webContents.executeJavaScript("for (const val of document.getElementsByClassName(\"ytp-popup\")) {val.parentElement.removeChild(val)}").then((fullScreen) =>{})
    },500
  )
  win.webContents.executeJavaScript("for (const val of document.getElementsByClassName(\"ytp-popup\")) {val.parentElement.removeChild(val)}").then((fullScreen) =>{})
})

app.on('window-all-closed', ()=>app.quit())
