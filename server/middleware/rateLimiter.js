import {rateLimit} from 'express-rate-limit' ; 
import {RedisStore} from 'rate-limit-redis' ; 
import redisClient from '../config/redis.js';
 export const slidingWindowLimiter = (maxRequests,windowSeconds ) => {
    return async(req,res,next) => {
        // get email if available 
        const email = req.body?.email ; 

        // get user's Ip 
        const ip = req.ip ;
        
        // use both email and ip
        const identifier = email ? `${email} : ${ip}` : ip ;
        
        // create a unique redis key for this endpoint 
        const key = `ratelimit : ${identifier} : ${req.originalUrl}` ; 

        // current time in milliseconds 
        const now = Date.now() ; 
        
        // Beginning of sliding windows 
        const windowStart = now - windowSeconds * 1000 ; 
        try {
            //Remove requests older than our window 
            await redisClient.zRemRangeByScore(
                key , 0 , windowStart
            );

            // count requests currently inside the window 
            const requestCount = await redisClient.zCard(key) ; 

            //3
            if(requestCount >= maxRequests) {
                const ttl = await redisClient.ttl(key) ; 
                return res.status(429).json({
                    success : false, 
                    message :`Too may requests , Try again is ${ttl >0 ? ttl : windowSeconds} seconds.` , 
                })
            }

      // add current requests to Redis 
      await redisClient.zAdd(key , {
        score : now, 
        value : `${now}-${Math.random()}` , 
      })
     //automatic delete the key later 
      await redisClient.expire(key , windowSeconds) ; 
      // allow request to continue ; 
      next();
        } catch(error) {
           console.error('Rate limiter error :' , error) ; 
           // if redis goes down , don't block the user 
           next() ; 
        }


    }
 }