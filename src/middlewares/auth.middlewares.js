import createError from "http-errors";
import jwt from "jsonwebtoken"

export function authGuard(role){
    return (req, res, next)=>{
        try{
            const token = req.header("Authorization");
            if(!token)
                throw new Error("Authorization Token doesn't Exist")

            const jwtToken = token.split(' ')[1];

            const payload = jwt.verify(jwtToken, process.env.JWT_AUTHENTICATION_SECRET);

            
            if(!Object.keys(payload).includes(role))
                throw new Error("You don't have access to " + role + " role")

            req.user = payload.user;
            req.owner = payload.owner;
            req.ownerVerified = payload.ownerVerified;
            req.rider = payload.rider;
            req.riderVerified = payload.riderVerified;
            req.admin = payload.admin

            next();
        }
        catch(err){
            let error = new createError.Unauthorized(err.message)
            next(error)
        }
    }
}