import { redis } from "../index.js";

export const ratelimit = async (req, res, next) => {
    try {
        const ip = req.ip;
        const key = `rate_limit:${ip}`;
        const request = await redis.incr(key);

        if (request === 1) {
            await redis.expire(key, 60);   // After 60 sec key is expire
        }

        if (request > 5) {
            return res.status(429).json({message: "Too Many Request"});
        }

        next();

    } catch (error) {
        console.log(error);
    }
}