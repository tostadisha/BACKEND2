import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.SECRET_JWT, {
    expiresIn: "24h",
  });
  return token;
};
