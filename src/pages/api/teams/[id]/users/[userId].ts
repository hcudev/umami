import { canDeleteTeamUser, canUpdateTeam } from 'lib/auth';
import { useAuth, useValidate } from 'lib/middleware';
import { NextApiRequestQueryBody } from 'lib/types';
import { NextApiResponse } from 'next';
import { badRequest, methodNotAllowed, ok, unauthorized } from 'next-basics';
import { deleteTeamUser, getTeamUser, updateTeamUser } from 'queries';
import * as yup from 'yup';

export interface TeamUserRequestQuery {
  id: string;
  userId: string;
}

export interface TeamUserRequestBody {
  role: string;
}

const schema = {
  DELETE: yup.object().shape({
    id: yup.string().uuid().required(),
    userId: yup.string().uuid().required(),
  }),
  POST: yup.object().shape({
    role: yup
      .string()
      .matches(/team-member|team-guest/i)
      .required(),
  }),
};

export default async (
  req: NextApiRequestQueryBody<TeamUserRequestQuery, TeamUserRequestBody>,
  res: NextApiResponse,
) => {
  await useAuth(req, res);
  await useValidate(schema, req, res);

  const { id: teamId, userId } = req.query;

  if (req.method === 'POST') {
    if (!(await canUpdateTeam(req.auth, teamId))) {
      return unauthorized(res, 'You must be the owner of this team.');
    }

    const teamUser = await getTeamUser(teamId, userId);

    if (!teamUser) {
      return badRequest(res, 'The User does not exists on this team.');
    }

    const { role } = req.body;

    await updateTeamUser(teamUser.id, { role });

    return ok(res);
  }

  if (req.method === 'DELETE') {
    if (!(await canDeleteTeamUser(req.auth, teamId, userId))) {
      return unauthorized(res, 'You must be the owner of this team.');
    }

    const teamUser = await getTeamUser(teamId, userId);

    if (!teamUser) {
      return badRequest(res, 'The User does not exists on this team.');
    }

    await deleteTeamUser(teamId, userId);

    return ok(res);
  }

  return methodNotAllowed(res);
};
