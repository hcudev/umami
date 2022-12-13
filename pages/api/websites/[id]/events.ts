import { WebsiteMetric, NextApiRequestQueryBody } from 'lib/types';
import { canViewWebsite } from 'lib/auth';
import { useAuth, useCors } from 'lib/middleware';
import moment from 'moment-timezone';
import { NextApiResponse } from 'next';
import { badRequest, methodNotAllowed, ok, unauthorized } from 'next-basics';
import { getEventMetrics } from 'queries';

const unitTypes = ['year', 'month', 'hour', 'day'];

export interface WebsiteEventsRequestQuery {
  id: string;
  start_at: string;
  end_at: string;
  unit: string;
  tz: string;
  url: string;
  event_name: string;
}

export default async (
  req: NextApiRequestQueryBody<WebsiteEventsRequestQuery>,
  res: NextApiResponse<WebsiteMetric>,
) => {
  await useCors(req, res);
  await useAuth(req, res);

  const { id: websiteId, start_at, end_at, unit, tz, url, event_name } = req.query;
  const { user, shareToken } = req.auth;
  const userId = user?.id;
  const shared = shareToken?.websiteId === websiteId;

  if (req.method === 'GET') {
    const canView = canViewWebsite(userId, websiteId);

    if (!canView && !shared) {
      return unauthorized(res);
    }

    if (!moment.tz.zone(tz) || !unitTypes.includes(unit)) {
      return badRequest(res);
    }
    const startDate = new Date(+start_at);
    const endDate = new Date(+end_at);

    const events = await getEventMetrics(websiteId, {
      startDate,
      endDate,
      timezone: tz,
      unit,
      filters: {
        url,
        eventName: event_name,
      },
    });

    return ok(res, events);
  }

  return methodNotAllowed(res);
};
