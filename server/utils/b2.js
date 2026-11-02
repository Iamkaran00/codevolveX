import fs from 'fs' ; 
import path from 'path' ; 
import {Upload} from '@aws-sdk/lib-storage'
import { CreateMultipartUpload$, CreateMultipartUploadCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../config/S3Client.js';
import { GetObjectCommand,PutObjectCommand , HeadObjectCommand } from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'; 
export const isB2Key = (v) => v && !v.startsWith("http"); // old Cloudinary URLs start with http
const bucket = () => process.env.B2_BUCKET_NAME ; 
export const getSignedVideoUrl = (key, expiresIn = 6 * 60 * 60 ) =>
  getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.B2_BUCKET_NAME, Key: key }),
    { expiresIn }
  );
export const uploadToB2 = async (file) => {
    const key = `videos/${Date.now()}-${path.basename(file.originalname).replace(/\s+/g, "_")}` ; 
    try {
        await new Upload({
            client : s3 , 
            params : {
                Bucket : process.env.B2_BUCKET_NAME,
                Key : key , 
                Body : fs.createReadStream(file.path) , 
                ContentType : file.mimetype , 
            } , 
        }).done() ;
        return key  ;  
        } 
        finally {
            fs.unlink(file.path,()=>{}) ; // remove multer temp file
        }
    
} ; 

export const deleteFromB2 = async(key) => {
    if(!key) return ; 
    await s3.send(new DeleteObjectCommand({Bucket : process.env.B2_BUCKET_NAME , Key : key})) ; 
}
 
export const buildVideoKey = (subSectionId , fileName) => `videos/${subSectionId}/${Date.now()}-${path.basename(String(fileName)).replace(/[^\w.-]/g,"_")}` ; 

export const getSignedUploadUrl = (key ,contentType,expiresIn = 6 * 60 * 60 ) => getSignedUrl(s3 , new PutObjectCommand({Bucket : BUCKET , Key : key , ContentType : contentType}),{expiresIn})

export const getObjectSize = async (key) => {
    const head = await s3.send(new HeadObjectCommand({Bucket : BUCKET , Key : key})) ; 
    return head.ContentLength ;
}


export const PART_SIZE = 10 * 1024 * 1024 ; // Minimum Part should be 10 mb

export const startMultiPart = async ( key , contentType) => {
    const {UploadId} = await s3.send(
        new CreateMultipartUploadCommand({Bucket : bucket() , Key : key , ContentType : contentType}) 
    );
    return UploadId ; 
}
export const getPartUrls = (key, uploadId, partNumbers, expiresIn = 6 * 60 * 60) =>
  Promise.all(
    partNumbers.map((n) =>
      getSignedUrl(
        s3,
        new UploadPartCommand({ Bucket: bucket(), Key: key, UploadId: uploadId, PartNumber: n }),
        { expiresIn }
      )
    )
  );
  // step 3: tell B2 to join the parts (needs the ETag receipt for each part)
export const finishMultipart = (key, uploadId, parts) =>
  s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: bucket(),
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts
          .map((p) => ({ PartNumber: p.PartNumber, ETag: p.ETag }))
          .sort((a, b) => a.PartNumber - b.PartNumber),
      },
    })
  );

  // cancel: discard all uploaded parts
export const abortMultipart = (key, uploadId) =>
  s3.send(new AbortMultipartUploadCommand({ Bucket: bucket(), Key: key, UploadId: uploadId }));