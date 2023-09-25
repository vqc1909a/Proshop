import * as url from 'url';
import multer from "multer";
import path from "path";
import { nanoid } from 'nanoid'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Es importante tener en cuenta que multer.memoryStorage puede ser útil para cargas temporales y reducir la carga en el sistema de archivos del servidor, pero puede no ser adecuado si necesitas manejar archivos grandes o múltiples simultáneamente, ya que puede afectar el rendimiento y el uso de memoria del servidor.

// En resumen, multer.diskStorage guarda los archivos en el disco y es útil cuando necesitas acceder a los archivos posteriormente, mientras que multer.memoryStorage almacena los archivos en memoria y es adecuado para operaciones en memoria o para cargas temporales que no requieren persistencia en el disco.

export const storageProducts = multer.diskStorage({
  // La función cb acepta dos parámetros: error y destino.
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/dist/uploads/products/'));
  },
  filename: (req, file, cb) => {
    // {
    //   file: {
    //     fieldname: 'imagen',
    //     originalname: 'adventure-time-dark-souls-theme.jpg',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg'
    //   }
    // }
    const fileArray = file.originalname.split('.');
    const fileExtension = fileArray[fileArray.length - 1];
    const fileName =  fileArray[fileArray.length - 2]
    const allowedExtensions = /jpeg|jpg|png|gif/i;
    const isImage = allowedExtensions.test(fileExtension) && allowedExtensions.test(file.mimetype);
    if(isImage){
      const fullName = fileName + '-' + nanoid() + '.' + fileExtension;
      cb(null, fullName)
    }else{
        cb(new Error('El archivo no es un tipo de imagen válido'))
    }
  }
});