import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { AppError } from './../errors/AppError';
class AnswerController {
  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { id } = req.query;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.findOne({ id: String(id) });
    if (!surveyUser) {
      throw new AppError('Survey User does not exists!', 400);
    }

    surveyUser.value = +value;
    const surveyUserSaved = await surveyUserRepository.save(surveyUser);
    res.json(surveyUserSaved);
  }
}

export { AnswerController };
