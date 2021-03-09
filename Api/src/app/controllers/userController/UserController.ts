import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../../repositories/UsersRepository";
import * as Yup from "yup";
import { AppErr } from "../../err/AppErr";

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = Yup.object().shape({
      name: Yup.string().required("O nome é obrigatório"),
      email: Yup.string().email().required("E-mail incorreto"),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppErr("Validation Failed!");
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      throw new AppErr("usuário já existente");
    }

    const user = usersRepository.create({
      name,
      email,
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
