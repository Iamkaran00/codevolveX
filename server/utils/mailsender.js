// import * as nodemailer from 'nodemailer';
// import {Resend} from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY) ;

// const mailsender = async (email ,title,body) => {
    
//     try {
//       const {data , error} = await resend.emails.send({
//         from : 'CodevolveX <onboarding@resend.dev>' ,
//         to : email,
//         subject : title,
//         html : body
// })
//   if(error){ console.log('resend error' , error) ; return null;}
//         return data;
//     } catch (error) {
//          console.log(error.response);
//          return null;
//     }
// }


// // const mailsender = async (email, title, body) => {
// //   try{
    
// //    let transporter = nodemailer.createTransport({
// //     host: process.env.MAIL_HOST,
// //     port: process.env.MAIL_PORT,
// //     secure: true, 
// //     auth: {
// //         user: process.env.MAIL_USER,
// //         pass: process.env.MAIL_PASS,
// //     }
// // })
// //     let info = await transporter.sendMail({
// //         from: `CodevolveX <${process.env.MAIL_USER}>`,
// //         to:`${email}`,
// //         subject: `${title}`,
// //         html: `${body}`,
// //     })
 
 
// //     return info;
// // }
// // catch(error) {
// // console.log(error.message);
// // }
// // };
 
// export default mailsender;

import * as brevo from '@getbrevo/brevo' ; 

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKey.apiKey,process.env.BREVO_API_KEY) ;

const mailsender = async (email, title , body) => {
    try {
        const sendSmtpEmail = new brevo.SendSmtpEmail() ;
      sendSmtpEmail.subject = title ; 
      sendSmtpEmail.htmlContent = body ; 
      sendSmtpEmail.sender = {name : 'codevolveX' , email : process.env.MAIL_USER} ;
    sendSmtpEmail.to = [{email : email}] ;
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data;
    } catch (error) {
        console.log('Brevo Error' , error.message) ; 
        return null;
    }
}
export default mailsender;