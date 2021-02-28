import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from './../errors/AppError';

class UserController {
  async findAll(req: Request, res: Response) {
    const userRepository = getCustomRepository(UserRepository);

    const users = await userRepository.find();
    return res.json(users);
  }

  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    try {
      const schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required()
      });

      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error });
    }

    const userRepository = getCustomRepository(UserRepository);

    const alreadyExists = await userRepository.findOne({ email });
    if (alreadyExists) {
      throw new AppError(`User already exists: ${name}`, 409);
    }

    const user = userRepository.create({ name, email });
    const userSaved = await userRepository.save(user);

    return res.status(201).json(userSaved);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({ id });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    userRepository.delete(user.id);

    return res.status(204).send();
  }
}

export { UserController };
