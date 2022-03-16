const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    getPaths() {
      ipcRenderer.send('get-paths', process.env.PATHS);
      // console.log(process.env.PATHS);

      if (typeof process.env.PATHS !== 'undefined') {
        const paths = process.env.PATHS.split(';');
        // console.log(paths);
        return paths;
      }

      return null;
    },
    getTree(path) {
      return {
        name: path,
        children: [
          { name: 'Foo.txt' },
          { name: 'Bar-Folder', children: [{ name: 'Bar.txt' }] },
        ],
      };
    },
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
