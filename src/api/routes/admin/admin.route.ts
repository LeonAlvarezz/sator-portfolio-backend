import { validateData } from "@/utils/validator";
import { Router } from "express";
import { AdminController } from "../../controllers/admin.controller";
import { AssignAdminRoleSchema } from "@/types/admin.type";
import protectedRoute from "@/authentication/protected-route";
import { LoginSchema, SignUpSchema } from "@/types/auth.type";
import { AccessType } from "@/types/base.type";
const router = Router();
const adminController = new AdminController();
export default (app: Router) => {
  app.use("/", router);
  router.get(
    "/",
    protectedRoute(adminController.getAdmins, AccessType.AUTH_ONLY, {
      resource: "Admin",
      action: "read",
    })
  );
  router.get("/me", adminController.getMe);
  // router.get("/", adminController.getAdmins);
  router.post("/signup", validateData(SignUpSchema), adminController.signup);
  router.post("/login", validateData(LoginSchema), adminController.login);
  router.post("/signout", adminController.signout);
  router.post("/totp", protectedRoute(adminController.updateTotp));
  router.post(
    "/assign",
    validateData(AssignAdminRoleSchema),
    protectedRoute(adminController.assignRole, AccessType.AUTH_ONLY, {
      resource: "Admin",
      action: "write",
    })
  );
};
