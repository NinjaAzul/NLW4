import { Router } from "express";
//Controllers
import { UserController } from "../src/app/controllers/userController/UserController";
import { SurveysController } from "../src/app/controllers/surveysController/SurveysController";
import { SendMailController } from "../src/app/controllers/surveyUserController/SendMailController";
import { AnswerController } from "../src/app/controllers/surveyUserController/AnswerController";
import { NpsController } from "../src/app/controllers/surveyUserController/NpsController";
//VAR-ROTAS
const router = Router();
const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

//ROTAS
router.post("/users", userController.create);
router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);
router.post("/sendMail", sendMailController.execute);
router.get("/answers/:value", answerController.execute);
router.get("/nps/:survey_id", npsController.execute);

export { router };

