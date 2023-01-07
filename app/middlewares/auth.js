import jwt from "jsonwebtoken";
import { User } from "../models/user";


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const decode = jwt.verify(token, "thisisnewsecretcode");

    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch {

    res.status(401).send({ error: "Please Validate" });
  }
};

export { authMiddleware };
