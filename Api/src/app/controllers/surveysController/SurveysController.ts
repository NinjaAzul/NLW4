import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../../repositories/SurveysRepository";

class SurveysController {
  //Create
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({
      title,
      description,
    });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  //Read or List
  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveyListAll = await surveysRepository.find();
    return response.json(surveyListAll);
  }
}

export { SurveysController };
