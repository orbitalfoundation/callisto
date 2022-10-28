
const { remote, contextBridge, ipcRenderer, app, BrowserWindow } = require('electron')

contextBridge.exposeInMainWorld('orbital', {
	channel: (command) => {
		ipcRenderer.send('view-command-async',command)
		// can sendSync() also
	}
})
