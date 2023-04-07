import { Request, Response } from 'express';
import { User } from '../entity/User';
import { UserRole } from '../types';
import { UserService } from './UserService';

export class UserController {
  userService = new UserService();

  // Get currently logged in user
  async getProfile(request: Request, response: Response) {
    return request.session['profile'];
  }

  async get(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      response.status(400);
      return;
    }
    const user = await User.findOne({ where: { id } });
    if (!user) {
      response.status(404);
      return;
    }
    if (user.id === request.session['profile']?.id) {
      return user;
    } else {
      // exclude private info if not the same user
      return { id: user.id, displayName: user.displayName, role: user.role, teamId: user.teamId };
    }
  }

  async patch(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      response.status(400);
      return 'User not found';
    }
    if (id !== request.session['profile']?.id) {
      response.status(401);
      return 'Cannot patch a user profile other than your own';
    }
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
      request.session['profile'] = user;
      return user;
    } catch (err) {
      console.error(err.message);
      response.status(400);
      if (err.code === '23505') return 'Username already in use.';
    }
  }

  async signup(request: Request, response: Response) {
    const { role, username } = request.body;
    const duplicate = await User.findOne({ where: { displayName: username } });
    if (duplicate) {
      response.status(400);
      return 'Username already taken';
    }
    try {
      const user =
        role === UserRole.LEADER
          ? await this.userService.registerLeader(request.body)
          : await this.userService.registerMember(request.body);
      request.session['profile'] = user;
      return user;
    } catch (err) {
      console.error(err.message);
      response.status(400);
      return err.message;
    }
  }

  async login(request: Request, response: Response) {
    const { username, password } = request.body;
    const user = await User.findOne({ where: { displayName: username, password } });
    if (!user) {
      response.status(404);
      return 'Credentials not recognized';
    }
    request.session['profile'] = user;

    return user;
  }

  async logout(request: Request, response: Response) {
    request.session.destroy(() => {});
  }
}
