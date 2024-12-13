export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send("Usted no está autorizado");
    if (req.user.role != role) return res.status(403).send("No tiene permisos");
    next();
  };
};
