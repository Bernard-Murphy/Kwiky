import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sizeOf from "buffer-image-size";
import sharp from "sharp";
import ExifTransformer from "exif-be-gone";
import { Jimp } from "jimp";
import path from "path";
import gifResize from "@gumlet/gif-resize";
import { Duplex } from "stream";

const s3 = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_SECRET_ACCESS_ID,
    secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
});

const streamFromBuffer = (buffer) => {
  let readStream = new Duplex();
  readStream.push(buffer);
  readStream.push(null);
  return readStream;
};

const generateThumbnail = (file) =>
  new Promise(async (resolve, reject) => {
    try {
      const fileBuffer = file.data;
      const extension = path.extname(file.name).toLowerCase();
      let thumbnail;
      let exifTransform;
      let pieces;
      if (extension === ".gif") {
        await (() =>
          new Promise((resolveThumbnail, rejectThumbnail) => {
            try {
              gifResize({
                width: 250,
                height: 250,
              })(fileBuffer)
                .then(async (data) => {
                  thumbnail = file.md5 + extension;
                  pieces = [];
                  exifTransform = new ExifTransformer();
                  exifTransform.on("data", (data) => pieces.push(data));
                  exifTransform.on("end", async () => {
                    const imageBuffer = Buffer.concat(pieces);
                    try {
                      await s3.send(
                        new PutObjectCommand({
                          Body: imageBuffer,
                          Bucket: "f.feednana.com",
                          Key: "thumbnails/" + thumbnail,
                          ACL: "public-read",
                          ContentType: file.mimetype,
                        })
                      );
                      resolveThumbnail();
                    } catch (err) {
                      reject(err);
                    }
                  });
                  const readStream = streamFromBuffer(data);
                  readStream.pipe(exifTransform);
                })
                .catch((err) => {
                  console.log(err);
                  return rejectThumbnail();
                });
            } catch (err) {
              console.log(err);
              return rejectThumbnail();
            }
          }))();
      } else {
        await (() =>
          new Promise(async (resolveThumbnail, rejectThumbnail) => {
            try {
              const dimensions = sizeOf(fileBuffer);
              if (extension === ".svg") {
                const thumbnailBuffer = await sharp(fileBuffer)
                  .png()
                  .resize({
                    fit: sharp.fit.contain,
                    [dimensions.height > dimensions.width
                      ? "height"
                      : "width"]: 250,
                  })
                  .toBuffer();
                thumbnail = file.md5 + ".png";
                pieces = [];
                exifTransform = new ExifTransformer();
                exifTransform.on("data", (data) => pieces.push(data));
                exifTransform.on("end", async () => {
                  const imageBuffer = Buffer.concat(pieces);
                  try {
                    await s3.send(
                      new PutObjectCommand({
                        Body: imageBuffer,
                        Bucket: "f.feednana.com",
                        Key: "thumbnails/" + thumbnail,
                        ACL: "public-read",
                        ContentType: "image/png",
                      })
                    );
                    resolveThumbnail();
                  } catch (err) {
                    reject(err);
                  }
                });
                const readStream = streamFromBuffer(thumbnailBuffer);
                readStream.pipe(exifTransform);
              } else {
                if (extension === ".bmp") {
                  Jimp.read(fileBuffer, (err, image) => {
                    if (err) {
                      console.log(err);
                      reject(err);
                    } else
                      image.getBuffer("image/jpeg", async (err, buffer) => {
                        const thumbnailBuffer = await sharp(buffer)
                          .resize({
                            fit: sharp.fit.contain,
                            [dimensions.height > dimensions.width
                              ? "height"
                              : "width"]: 250,
                          })
                          .toBuffer();
                        thumbnail = file.md5 + ".jpeg";
                        pieces = [];
                        exifTransform = new ExifTransformer();
                        exifTransform.on("data", (data) => pieces.push(data));
                        exifTransform.on("end", async () => {
                          const imageBuffer = Buffer.concat(pieces);
                          try {
                            await s3.send(
                              new PutObjectCommand({
                                Body: imageBuffer,
                                Bucket: "f.feednana.com",
                                Key: "thumbnails/" + thumbnail,
                                ACL: "public-read",
                                ContentType: "image/jpeg",
                              })
                            );
                            resolveThumbnail();
                          } catch (err) {
                            reject(err);
                          }
                        });
                        const readStream = streamFromBuffer(thumbnailBuffer);
                        readStream.pipe(exifTransform);
                      });
                  });
                } else {
                  const thumbnailBuffer = await sharp(fileBuffer)
                    .resize({
                      fit: sharp.fit.contain,
                      [dimensions.height > dimensions.width
                        ? "height"
                        : "width"]: 250,
                    })
                    .toBuffer();
                  thumbnail = file.md5 + extension;
                  pieces = [];
                  exifTransform = new ExifTransformer();
                  exifTransform.on("data", (data) => pieces.push(data));
                  exifTransform.on("end", async () => {
                    const imageBuffer = Buffer.concat(pieces);
                    try {
                      await s3.send(
                        new PutObjectCommand({
                          Body: imageBuffer,
                          Bucket: "f.feednana.com",
                          Key: "thumbnails/" + thumbnail,
                          ACL: "public-read",
                          ContentType: file.mimetype,
                        })
                      );
                      resolveThumbnail();
                    } catch (err) {
                      reject(err);
                    }
                  });
                  const readStream = streamFromBuffer(thumbnailBuffer);
                  readStream.pipe(exifTransform);
                }
              }
            } catch (err) {
              console.log(err);
              return rejectThumbnail();
            }
          }))();
      }
      resolve(thumbnail);
    } catch (err) {
      console.log("process file error", err);
      return reject();
    }
  });

export default generateThumbnail;
