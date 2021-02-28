import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';

class NpsController {
  /**
   * Cálculo NPS
   * 1 2 3 4 5 6 7 8 9 10
   * Detratores: 0-6
   * Passivos: 7-8
   * Promotores: 9-10
   *
   * nps = (qtd_promotores - qtd_detratores) / (qtd_repondentes)
   */

  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveysUsers = await surveyUserRepository.find({ survey_id, value: Not(IsNull()) });

    const totalAnswers = surveysUsers.length;
    const detractors = surveysUsers.filter((su) => su.value >= 0 && su.value <= 6).length;
    const passive = surveysUsers.filter((su) => su.value >= 7 && su.value <= 8).length;
    const promoters = surveysUsers.filter((su) => su.value >= 9 && su.value <= 10).length;

    const nps = (((promoters - detractors) / totalAnswers) * 100).toFixed(2);

    res.json({
      detractors,
      promoters,
      passive,
      totalAnswers,
      nps
    });
  }
}

export { NpsController };
