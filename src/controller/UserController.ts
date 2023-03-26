import { Request, Response } from 'express';
import { User } from '../entity/User';
import { UserRole } from '../types';

export class UserController {
  // Get currently logged in user
  async getProfile(request: Request, response: Response) {
    const user = await User.findOne({ where: { role: UserRole.WRITER } });
    if (!user) {
      response.status(401);
      return;
    }
    return user;
  }

  async get(request: Request, response: Response) {
    // TODO: exclude password, email if not same profile
    const id = parseInt(request.params.id);
    const user = await User.findOne({ where: { id } });
    if (!user) {
      response.status(404);
      return;
    }
    return user;
  }

  async patch(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const user = await User.findOne({ where: { id } });
    if (!user) {
      response.status(404);
      return;
    }

    const { displayName, email, password } = request.body;
    user.displayName = displayName;
    user.email = email;
    user.password = password;

    try {
      await user.save();
    } catch (err) {
      console.error(err);
      response.status(400);
    }
    return user;
  }

  // async remove(request: Request, response: Response, next: NextFunction) {
  //     const id = parseInt(request.params.id)

  //     let userToRemove = await this.userRepository.findOneBy({ id })

  //     if (!userToRemove) {
  //         return "this user not exist"
  //     }

  //     await this.userRepository.remove(userToRemove)

  //     return "user has been removed"
  // }
}
