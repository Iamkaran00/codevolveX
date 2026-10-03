import IORedis from 'ioredis'; 
// just for bullmq kyunki mene redis chose kiya tha initially as dependency 

const bullConnection = new IORedis(process.env.REDIS_URL||'redis://127.0.0.1:6379',{
    maxRetriesPerRequest:null
}) ; 
bullConnection.on('error' , err=>{
    console.error('BullMq Redis error :' , err.message) ; 

})

export default bullConnection ; 