import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import SendMailService from '../services/SendMailService';
import { AppError } from './../errors/AppError';

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const userRespository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveyRepository);
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const user = await userRespository.findOne({ email });
    if (!user) {
      throw new AppError('User does not exists', 400);
    }

    const survey = await surveyRepository.findOne({ id: survey_id });
    if (!survey) {
      throw new AppError('Survey does not exists', 400);
    }

    let surveyUser = await surveyUserRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey']
    });

    if (!surveyUser) {
      surveyUser = surveyUserRepository.create({
        user_id: user.id,
        survey_id
      });

      await surveyUserRepository.save(surveyUser);
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: surveyUser.id,
      link: process.env.URL_MAIL
    };
    await SendMailService.execute(email, survey.title, variables, npsPath);

    return res.json(surveyUser);
  }
}

export { SendMailController };
