import {S3Client } from '@aws-sdk/client-s3' ; 

const s3 = new S3Client({
    region:process.env.B2_REGION,
    endpoint : process.env.B2_ENDPOINT,
    credentials : {
        accessKeyId : process.env.B2_KEY_ID,
        secretAccessKey : process.env.B2_APP_KEY,
    },  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

export default s3 ; 