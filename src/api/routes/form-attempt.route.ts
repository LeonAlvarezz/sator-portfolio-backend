import { Router } from "express";
import { FormAttemptController } from "../controllers/form-attempt.controller";
import protectedRoute from "@/authentication/protected-route";
import { AccessType } from "@/types/base.type";

const router = Router();
const formAttemptController = new FormAttemptController();

export default (app: Router) => {
  app.use("/form-attempt", router);
  // router.get("/", formAttemptController.findByUser);
  router.get(
    "/",
    protectedRoute(
      formAttemptController.paginateByUser,
      AccessType.ANONYMOUS_FRIENDLY
    )
  );
  router.get(
    "/:id",
    protectedRoute(
      formAttemptController.getAttemptById,
      AccessType.ANONYMOUS_FRIENDLY
    )
  );
  router.post(
    "/",
    protectedRoute(formAttemptController.create, AccessType.ANONYMOUS_FRIENDLY)
  );
  router.post(
    "/:id/bring-to-life",
    protectedRoute(formAttemptController.bringItToLife)
  );
};
