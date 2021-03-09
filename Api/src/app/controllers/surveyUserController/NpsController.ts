import { getCustomRepository, Not, IsNull } from "typeorm";
import { Response, Request } from "express";
import { SurveyUserRepository } from "../../repositories/SurveysUserRepository";
import * as Yup from 'yup';


//1 2 3 4 5 6 7 8 9 10
//
//Detratores => 0 - 6
//Passivos => 7 - 8
//Promotores => 9 - 10
//
// (Numero de promotores - numero de detratores) / (numero de respondentes) x 100
//

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUsersRepository = getCustomRepository(SurveyUserRepository);

    const surveyUsers = await surveyUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractor = surveyUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const promoters = surveyUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const passive = surveyUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const totalAnswers = surveyUsers.length;

    const calculate = Number(((promoters - detractor) / totalAnswers * 100).toFixed(2));

    return response.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NpsController };
