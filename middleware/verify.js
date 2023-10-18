const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
    // console.log("req in verify", req);  // Use 'req.headers.authorization' instead of 'res.Authorization'

    const token = req.headers.authorization;  // Use 'req.headers.authorization' instead of 'req.headers.Authorization'
    // console.log("token in verify", token);
    
    if (token) {
        jwt.verify(token, "private_key", function(err, decoded) {  // Use 'decoded' instead of 'decode'
            if (err) {
                res.status(401).json({ message: "Token is not valid", status: 0 });  // Use 'status(401)' instead of 'send'
            } else {
                req.user = decoded;  // Store the decoded token in the request object for later use if needed
                next();
            }
        });
    } else {
        res.status(401).json({ message: "Token not found", status: 0 });  // Use 'status(401)' instead of 'send'
    }
};

module.exports = verify;