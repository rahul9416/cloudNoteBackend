const jwt = require('jsonwebtoken');
const JWTSecret = 'Hey User!!';

const fetchuser = (req,res,next) => {
    // Get the user from jwt token and add the id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWTSecret);
        req.user = data.User;
        next()   
    } catch (error) {
        res.status(500).send({error: "Please authenticate using a valid token"})
    }
}

module.exports = fetchuser;