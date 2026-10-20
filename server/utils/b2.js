import fs from 'fs' ; 

import path from 'path' ; 

import {Upload} from '@aws-sdk/lib-storage'
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import s3 from '../config/S3Client.js';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'; 
export const isB2Key = (v) => v && !v.startsWith("http"); // old Cloudinary URLs start with http

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
 