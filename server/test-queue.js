import './workers/emailWorker.js' ; 

import {queueEmail , emailQueue , PRIORITY} from './queues/emailQueue.js' ; 

await queueEmail(
    'test' , 
    {to : 'sahukaran6954@gmail.com' , subject : 'BullMQ test',html : '<p>Queue works</p>'},
    {priority : PRIORITY.NOTICE}

)
console.log('right after add : ', await emailQueue.getJobCounts()) ; 
setTimeout(async () => {
    console.log('after 5s : ' , await emailQueue.getJobCounts()) ; 
    process.exit(0) ; 

},5000) ; 