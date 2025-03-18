import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      // cb(null, './public/temp')
      const uploadPath = path.join(process.cwd(), 'public', 'temp');
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ storage: storage })