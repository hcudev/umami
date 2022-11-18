import { badRequest, hashPassword, methodNotAllowed, ok, unauthorized } from 'next-basics';
import { getUser, deleteUser, updateUser } from 'queries';
import { useAuth } from 'lib/middleware';
import { NextApiResponse } from 'next';
import { NextApiRequestQueryBody } from 'interface/api/nextApi';
import { User } from 'interface/api/models';

export interface UserRequestQuery {
  id: string;
}

export interface UserRequestBody {
  username: string;
  password: string;
}

export default async (
  req: NextApiRequestQueryBody<UserRequestQuery, UserRequestBody>,
  res: NextApiResponse<User>,
) => {
  await useAuth(req, res);

  const {
    user: { id: userId, isAdmin },
  } = req.auth;
  const { id } = req.query;

  if (req.method === 'GET') {
    if (id !== userId && !isAdmin) {
      return unauthorized(res);
    }

    const user = await getUser({ id });

    return ok(res, user);
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (id !== userId && !isAdmin) {
      return unauthorized(res);
    }

    const user = await getUser({ id });

    const data: any = {};

    if (password) {
      data.password = hashPassword(password);
    }

    // Only admin can change these fields
    if (isAdmin) {
      data.username = username;
    }

    // Check when username changes
    if (data.username && user.username !== data.username) {
      const userByUsername = await getUser({ username });

      if (userByUsername) {
        return badRequest(res, 'User already exists');
      }
    }

    const updated = await updateUser(data, { id });

    return ok(res, updated);
  }

  if (req.method === 'DELETE') {
    if (id === userId) {
      return badRequest(res, 'You cannot delete your own user.');
    }

    if (!isAdmin) {
      return unauthorized(res);
    }

    await deleteUser(id);

    return ok(res);
  }

  return methodNotAllowed(res);
};
