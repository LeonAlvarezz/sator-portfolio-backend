import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

export default (app: Router) => {
  app.use("/user", router);
  router.get("/me", userController.getMe);
  router.post("/", userController.userLogin);
  router.post("/anonymous-login", userController.anonymousLogin);
  router.post("/signout", userController.signout);
  router.post("/signup", userController.signup);
};
