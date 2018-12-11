"Requerimos el paquete de Electron"
"Traemos app y BrowserWindow"
const {app, BrowserWindow} = require('electron');

"Este paquete nos va a permitir usar loadURL() para poder cargar el index.html"
const url = require('url');

"Módulo de node para usar el path"
const path = require('path');

/**Módulo para llamar a electron-reload el cual permite refrescar la pantalla cada vez que ocurra un cambio en
el código*/
if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        //Aqui puedo poner los elementos que quiera reiniciar
    })
}

/**Creamos esta variable global con la finalidad de poder limpiar los recursos del computador cuando
la ventana se elimine*/
let mainWindow

app.on('ready', () =>{
    mainWindow = new BrowserWindow({})
    mainWindow.loadURL(url.format({
        //Propiedades a usar
        pathname: path.join(__dirname, 'views/index.html'), //__dirname hace referencia al src, le concateno la ruta del archivo a usar
        protocol: 'file', //Protocolo por el cual se va a cargar
        slashes : true // Dirección de navegador
    }))
})