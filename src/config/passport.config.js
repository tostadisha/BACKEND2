import passport from "passport";
import local, { Strategy } from "passport-local";
import userModel from "../models/user.model.js";
import jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils/hashingUtils.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => {
            return req && req.cookies ? req.cookies["coderCookie"] : null;
          },
        ]),
        secretOrKey: process.env.SECRET_JWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user, "Processo correcto");
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { firstName, lastName, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) return done(null, false, "El usuario ya existe");
          const newUser = {
            email: username,
            password: createHash(password),
            firstName,
            lastName,
            age,
          };
          const result = await userModel.create(newUser);
          return done(null, result, "Usuario registrado con éxito");
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user)
            return done(
              null,
              false,
              "El usuario al que se ha querido logear no existe"
            );
          if (!isValidPassword(user, password))
            return done(null, false, "La contraseña no es válida");
          return done(null, user, "Logeo exitoso");
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv23lilAIUmyKp89DwKV",
        clientSecret: "bbad54ab2a2e47b28fdc3cd8c860859ea16ef90f",
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async (_, __, profile, done) => {
        try {
          const user = await userModel.findOne({ idGithub: profile._json.id });
          if (user) return done(null, user);
          const newUser = {
            firstName: profile._json.name,
            idGithub: profile._json.id,
          };
          const result = await userModel.create(newUser);
          return done(
            null,
            result,
            "Se ha podido registrar con github exitosamente"
          );
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => {
            return req && req.cookies ? req.cookies["coderCookie"] : null;
          },
        ]),
        secretOrKey: process.env.SECRET_JWT,
      },
      async (jwt_payload, done) => {
        try {
          const user = await userModel.findById(jwt_payload.user._id);
          if (!user) return done(null, false, "El usuario no existe");
          return done(null, user, "Los datos son...");
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
