import express, { NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { User } from "../../db/entities/User.js";

const authorize = (
    req: express.Request,
    res: express.Response,
    next: NextFunction
) => {
    // crete token variable and it take authentication from middlewares to authorize it 
    const token = req.headers['authorization'] || '';
    console.log(token);
    // to check if token is valid
    let tokenIsValid;
    // we put it in try catch because sometimes maybe there are some errors
    try {
        // use verify to check if it right and not expired
        console.log("process.env.DB_JWT", process.env.DB_JWT);
        tokenIsValid = jwt.verify(token, process.env.DB_JWT || ''); // idk why walled add this
        console.log("tokenIsValid", tokenIsValid);

    } catch (error) {
        console.log(error);
    }

    if (tokenIsValid) {
        // decode to decode token 
        let decoded = jwt.decode(token)?.toString();
        decoded = JSON.parse(decoded || '')
        const user = User.findOneBy({})
        res.locals.user = decoded
        next();
    } else {
        res.status(401).send("you are unauthorized")
    }
}

// are token valid and are token still valid

export { authorize };