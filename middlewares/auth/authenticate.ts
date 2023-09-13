import express from 'express'


const authorize = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    console.log("Roles", res.locals.user.roles)
    console.log("Method", req.method)
    console.log("Path", req.path)

    next();
}
export { authorize }