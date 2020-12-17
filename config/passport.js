require('dotenv').config();

// A passport strategy for authetication with a JSON Web Token
// This allows to authenticate 
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = { };
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// JWT_SECRET is inside of our enviroment.
options.sercretOrKey = process.env.JWT_SECRET;


module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        // Have a user we're going to find by the id in the payload
        // When we get a user back, we will check to see if user is in database.
        
    }))
}
