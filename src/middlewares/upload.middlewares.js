// middlewares/uploadMiddleware.js
import multer from "multer";

// Set up multer to store files temporarily in the 'uploads' directory
const storage = multer.memoryStorage();

const upload = multer({ storage });

export { upload }