import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { AppError } from './../errors/AppError';

class SurveyController {
  async findAll(req: Request, res: Response) {
    const surveyRepository = getCustomRepository(SurveyRepository);

    const surveys = await surveyRepository.find();
    return res.json(surveys);
  }

  async create(req: Request, res: Response) {
    const { title, description } = req.body;

    const surveyRepository = getCustomRepository(SurveyRepository);

    const survey = surveyRepository.create({ title, description });
    const surveySaved = await surveyRepository.save(survey);

    return res.status(201).json(surveySaved);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const surveyRepository = getCustomRepository(SurveyRepository);

    const survey = await surveyRepository.findOne({ id });
    if (!survey) {
      throw new AppError('Survey not found', 404);
    }

    surveyRepository.delete(survey.id);

    return res.status(204).send();
  }
}

export { SurveyController };
