export interface Website {
  id: string;
  userId: string;
  revId: number;
  name: string;
  domain: string;
  shareId: string;
  createdAt: Date;
}

export interface Share {
  id: string;
  token: string;
}

export interface Empty {}

export interface WebsiteActive {
  x: number;
}

export interface WebsiteEventDataMetric {
  [key: string]: number;
}

export interface WebsiteMetric {
  x: string;
  y: number;
}

export interface WebsiteEventMetric {
  x: string;
  t: string;
  y: number;
}

export interface WebsitePageviews {
  pageviews: {
    t: string;
    y: number;
  };
  sessions: {
    t: string;
    y: number;
  };
}

export interface WebsiteStats {
  pageviews: { value: number; change: number };
  uniques: { value: number; change: number };
  bounces: { value: number; change: number };
  totalTime: { value: number; change: number };
}

export interface RealtimeInit {
  websites: Website[];
  token: string;
  data: RealtimeUpdate;
}

export interface RealtimeUpdate {
  pageviews: any[];
  sessions: any[];
  events: any[];
  timestamp: number;
}
