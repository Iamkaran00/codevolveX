import redisClient from "../config/redis.js"; 

export const getOrSetCache = async(key , ttlSeconds,fetchFn) => {
    try {
        const cached = await redisClient.get(key) ; 
        if(cached) {
            
            return {data :JSON.parse(cached) , fromCache : true} 
        }
    } catch (error) {
        console.error('Redis GET error' , error) ; 
        // fall through to DB fetch - fail open
    }
    const freshData = await fetchFn() ;
    try {
        await redisClient.setEx(key , ttlSeconds , JSON.stringify(freshData)) ; 
        
    } catch (error) {
        console.error('Redis Set Error' , err) ; 
    }
    return {data : freshData , fromCache : false} ; 
};
export const invalidateCache = async(...keys)=> {
    try {
        if(keys.length) await redisClient.del(keys) ; 

    } catch (error) {
        console.error('Redis Del error : ',err) ; 
    }
}

export const invalidateCacheByPattern = async(pattern) => {
    try {
        const keys = await redisClient.keys(pattern) ; 
        if(keys.length) await redisClient.del(keys) ; 
    } catch (error) {
        console.error('Redis pattern Del error :',error) ; 
    }
}
