import createHttpError from "http-errors";
import { bucket } from "../configs/firebase.config.js";
// Function to upload file to Firebase Storage
export async function uploadFileToFirebase(filePath, fileName, file) {
    try {
        if (!file) {
            throw new createHttpError.BadRequest("File doesn't exist");
        }
        console.log(file);
        console.log(file.originalname);
        // Create a unique file name in Firebase storage
        let fileExtension = file.originalname.split(".").pop();
        const blob = bucket.file(`${filePath}/${fileName}.${fileExtension}`);

        // Create a stream to upload file to Firebase storage using Promises
        await new Promise((resolve, reject) => {
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            blobStream.on("error", (err) => {
                reject(err); // Reject the promise on error
            });

            blobStream.on("finish", resolve); // Resolve the promise on finish

            blobStream.end(file.buffer); // End the stream and upload file
        });

        await blob.makePublic();
        // The public URL can be used to directly access the file via HTTP.
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        return fileUrl;
    } catch (error) {
        throw new createHttpError.InternalServerError(error.message);
    }
}