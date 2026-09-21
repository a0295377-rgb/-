import { Router, type IRouter } from "express";
import healthRouter from "./health";
import akademiyatiRouter from "./academiyati";

const router: IRouter = Router();

router.use(healthRouter);
router.use(akademiyatiRouter);

export default router;
