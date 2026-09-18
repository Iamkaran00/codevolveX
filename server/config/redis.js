import { createClient } from "redis";

const redisClient = createClient({
    url : process.env.REDIS_URL , 
}) ; 

redisClient.on("error" , err => {
    console.error("Redis Error" , err) ; 
})

redisClient.on('ready' , ()=> {
    console.log('redis connected')  ; 
})

export default redisClient ; 