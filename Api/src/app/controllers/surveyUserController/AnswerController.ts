import { getCustomRepository } from "typeorm";
import { Response, Request } from "express";
import { SurveyUserRepository } from "../../repositories/SurveysUserRepository";
import { AppErr } from "../../err/AppErr";

class AnswerController {
  //http://localhost:3001/answers/1?u=595f9848-bdc8-4e27-a288-c22f4472f1e4

  //Route Params => Parametros que compoem a rota /

  //routes.get("/answers/:value")

  //QueryParams => Busca, Paginaginação, não obrigatorios

  //Chave=Valor

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.findOne({
      id: String(u),
    });

    if (!surveyUser) {
      throw new AppErr("Survey user does not exists!");
    }

    surveyUser.value = Number(value);

    await surveyUserRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };
