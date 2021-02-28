import { Router } from 'express';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';
import { SendMailController } from './controllers/SendMailController';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

const router = Router();

router.get('/users', userController.findAll);
router.post('/users', userController.create);
router.delete('/users/:id', userController.delete);

router.get('/surveys', surveyController.findAll);
router.post('/surveys', surveyController.create);
router.delete('/surveys/:id', surveyController.delete);

router.post('/sendMail', sendMailController.execute);

router.get('/answers/:value', answerController.execute);

router.get("/nps/:survey_id", npsController.execute)

export { router };
