import { resolve } from "path";
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../../repositories/SurveysRepository";
import { SurveyUserRepository } from "../../repositories/SurveysUserRepository";
import { UsersRepository } from "../../repositories/UsersRepository";
import SendMailService from "../../services/SendMailService";
import { AppErr } from "../../err/AppErr";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);

    const user = await usersRepository.findOne({
      email,
    });

    if (!user) {
      throw new AppErr("User does not exists");
    }

    const survey = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!survey) {
      throw new AppErr("Survey does not exists");
    }

    const npsPath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "npsMail.hbs"
    );

    const surveyUserAlreadyExists = await surveyUserRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ["user", "survey"],
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
      image:
        "https://th.bing.com/th/id/R9c48d5bef3c2eecebb63a1ba4c4c6c6c?rik=PQHa6p0vOOw33A&riu=http%3a%2f%2fwww.sindigraficos.com.br%2fwp-content%2fuploads%2f2018%2f04%2fmagiccity.png&ehk=RlScyBV6uA78yE3rlywTRzUD6h46P%2btcuDy6ZgdpWTQ%3d&risl=&pid=ImgRaw",
    };

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists);
    }

    //salva informações do e-mail
    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveyUserRepository.save(surveyUser);

    //Envia e-mail para usúario
    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);
  }
}

export { SendMailController };
