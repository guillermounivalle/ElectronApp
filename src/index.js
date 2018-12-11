"Requerimos el paquete de Electron"
"Traemos app, BrowserWindow, Menu"
const {app, BrowserWindow, Menu, ipcMain} = require('electron');

"Este paquete nos va a permitir usar loadURL() para poder cargar el index.html"
const url = require('url');

"Módulo de node para usar el path"
const path = require('path');

/**Módulo para llamar a electron-reload el cual permite refrescar la pantalla cada vez que ocurra un cambio en
el código*/
if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        //Aqui puedo poner los elementos que quiera reiniciar
        //"/refrescamos al cambiar un proceso de Electron"
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

/**Creamos esta variable global con la finalidad de poder limpiar los recursos del computador cuando
la ventana se elimine*/
let mainWindow

/**
 * Creamos esta variable para poder guaradar la ventana que se crea cuando se llama la funciòn createNewProductWindow 
 */
let newProductWindow

app.on('ready', () =>{
    mainWindow = new BrowserWindow({})
    mainWindow.loadURL(url.format({
        //Propiedades a usar
        pathname: path.join(__dirname, 'views/index.html'), //__dirname hace referencia al src, le concateno la ruta del archivo a usar
        protocol: 'file', //Protocolo por el cual se va a cargar
        slashes : true // Dirección de navegador
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu); //Pasamos nuestros template
    Menu.setApplicationMenu(mainMenu); //Aquí lo activamos

    //Esta funciòn lo que permite es cerrar toda la aplicaciòn y las subventanas que se hayan abierto
    mainWindow.on('closed', () =>{
        app.quit();
    });
});

function createNewProductWindow (){
    newProductWindow = new BrowserWindow({
        width: 400,
        height: 330,
        title: 'Add New Product'
    });
    newProductWindow.setMenu(null)
    newProductWindow.loadURL(url.format({
        //Propiedades a usar
        pathname: path.join(__dirname, 'views/new-product.html'), //__dirname hace referencia al src, le concateno la ruta del archivo a usar
        protocol: 'file', //Protocolo por el cual se va a cargar
        slashes : true // Dirección de navegador
    }))
    newProductWindow.on('closed', () => {
        newProductWindow = null;
    })
}

/**
 * Escuchamos el protocolo de ipcRenderer para recibir lo que nos envìa new-product.html
 */
ipcMain.on('product:new', (event, newProduct) => {
    mainWindow.webContents.send('product:new', newProduct);//Se lo enviamos al index.html
    newProductWindow.close(); //Cerramos la ventana de new-product.html
});

/**
 * En este arreglo creamos nuestro propio menu. Este template lo usaremos en  Menu.buildFromTemplate()
})
 */
const templateMenu = [
    {
        label: 'File',
        submenu:[
            {
                label: 'New Product',
                accelerator: 'Ctrl+N',  //Este se usa para crearle un atajo de teclado
                click(){
                   createNewProductWindow();
                }
            },
            {
                label: 'Remove all Products',
                click(){
                    mainWindow.webContents.send('products:remove-all');
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'command+Q':'Ctrl+Q', //Pregunto si el SO es MAc o Windows o Linux
                click(){
                    app.quit();
                }
            }
        ]
    }    
]

/**
 * Este condicional nos permite poner el nombre de la aplicaciòn cuando se estè usando desde una màquina con MacOS
 * Si es otro SO no usa el nombre
 */
if(process.platform === 'darwin'){
    templateMenu.unshift({
        label: app.getName()
    })
}

/**
 * Herramientas de desarrollo
 */
if(process.env.NODE_ENV !== 'production'){
    templateMenu.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'Show/Hide Dev Tools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
