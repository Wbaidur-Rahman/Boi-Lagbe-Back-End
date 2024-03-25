// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/people'); // Assuming you have a User model

// // Define the LocalStrategy for username/password authentication
// passport.use(
//     new LocalStrategy(
//         { usernameField: 'email' }, // Assuming the username field is 'email'
//         async (email, password, done) => {
//             try {
//                 // Find user by email
//                 const user = await User.findOne({ email });

//                 // If user not found or password is incorrect
//                 if (!user || !(await user.isValidPassword(password))) {
//                     return done(null, false, { message: 'Invalid email or password' });
//                 }

//                 // If user found and password is correct
//                 return done(null, user);
//             } catch (error) {
//                 return done(error);
//             }
//         }
//     )
// );

// // Serialize user into the session
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// // Deserialize user from the session
// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error);
//     }
// });

// module.exports = passport;

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/people'); // Assuming you have a User model

module.exports = (passport) => {
    // Define the LocalStrategy for username/password authentication
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' }, // Assuming the username field is 'email'
            async (email, password, done) => {
                try {
                    // Find user by email
                    const user = await User.findOne({ email });

                    // If user not found or password is incorrect
                    if (!user || !(await user.isValidPassword(password))) {
                        return done(null, false, { message: 'Invalid email or password' });
                    }

                    // If user found and password is correct
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Serialize user into the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
