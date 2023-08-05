const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../schemas/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const keys = require("../config/keys");

// Local strategy for username/password login
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username: username });
			if (!user) {
				return done(null, false, { message: "Incorrect username." });
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return done(null, false, { message: "Incorrect password." });
			}

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

// JWT strategy for token authentication
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: keys.jwtSecret,
};

passport.use(
	new JwtStrategy(jwtOptions, (jwtPayload, done) => {
		User.findById(jwtPayload.id)
			.then((user) => {
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			})
			.catch((err) => done(err, false));
	})
);
