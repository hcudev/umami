import cache from 'lib/cache';
import clickhouse from 'lib/clickhouse';
import { CLICKHOUSE, PRISMA, runQuery } from 'lib/db';
import prisma from 'lib/prisma';
import { EVENT_TYPE } from 'lib/constants';
import { getWebsite } from 'queries';

export async function getPageviewStats(
  ...args: [
    websiteId: string,
    data: {
      startDate: Date;
      endDate: Date;
      timezone?: string;
      unit?: string;
      count?: string;
      filters: object;
      sessionKey?: string;
    },
  ]
) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

async function relationalQuery(
  websiteId: string,
  data: {
    startDate: Date;
    endDate: Date;
    timezone?: string;
    unit?: string;
    count?: string;
    filters: object;
    sessionKey?: string;
  },
) {
  const {
    startDate,
    endDate,
    timezone = 'utc',
    unit = 'day',
    count = '*',
    filters = {},
    sessionKey = 'session_id',
  } = data;
  const { toUuid, getDateQuery, parseFilters, rawQuery } = prisma;
  const website = await getWebsite({ id: websiteId });
  const resetDate = website?.resetAt || website?.createdAt;
  const params: any = [websiteId, resetDate, startDate, endDate];
  const { filterQuery, joinSession } = parseFilters(filters, params);

  return rawQuery(
    `select ${getDateQuery('website_event.created_at', unit, timezone)} x,
        count(${count !== '*' ? `${count}${sessionKey}` : count}) y
      from website_event
        ${joinSession}
      where website_event.website_id = $1${toUuid()}
        and website_event.created_at >= $2
        and website_event.created_at between $3 and $4
        and event_type = ${EVENT_TYPE.pageView}
        ${filterQuery}
      group by 1`,
    params,
  );
}

async function clickhouseQuery(
  websiteId: string,
  data: {
    startDate: Date;
    endDate: Date;
    timezone?: string;
    unit?: string;
    count?: string;
    filters: object;
    sessionKey?: string;
  },
) {
  const { startDate, endDate, timezone = 'UTC', unit = 'day', count = '*', filters = {} } = data;
  const {
    parseFilters,
    getDateFormat,
    rawQuery,
    getDateStringQuery,
    getDateQuery,
    getBetweenDates,
  } = clickhouse;
  const website = await cache.fetchWebsite(websiteId);
  const resetDate = website?.resetAt || website?.createdAt;
  const params = { websiteId };
  const { filterQuery } = parseFilters(filters, params);

  return rawQuery(
    `select
      ${getDateStringQuery('g.t', unit)} as x, 
      g.y as y
    from
      (select 
        ${getDateQuery('created_at', unit, timezone)} t,
        count(${count !== '*' ? 'distinct session_id' : count}) y
      from event
      where website_id = {websiteId:UUID}
        and event_type = ${EVENT_TYPE.pageView}
        and created_at >= ${getDateFormat(resetDate)}
        and ${getBetweenDates('created_at', startDate, endDate)}
        ${filterQuery}
      group by t) g
    order by t`,
    params,
  );
}
