import  passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';
import AuthConfig from '@configs/authentication';
import { adminRepo } from '@repos/site/admin.repo';
import { IAdmin } from '@models/site/admin.model';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: AuthConfig.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
    const admin = await adminRepo.findOne({ _id: jwt_payload.sub });
    
    if (admin) {
      if (admin.isBlocked) {
        return done('Your account is banned!', false);
      }
      return done(null, <IAdmin>{ _id: admin._id });
    }
    done(null, false);
  } catch (err) {
    done(err, false);
  }
}));

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
  },
  async function (username, password, done) {
    try {
      const admin = await adminRepo.checkCredential(username, password);
      
      if (admin) {
        if (admin.isBlocked) {
          return done('Your account is banned!', false);
        }
        return done(null, {
          _id: admin._id,
          username: admin.username,
          picture: admin.picture,
          email: admin.email
        });
      }
      return done(null, false);

    } catch (err) {
      console.log(err);
      return done(err, false);
    }
  }
));

function jwtAuth() {
  return passport.authenticate('jwt', { session: false });
}

export  { passport, jwtAuth };