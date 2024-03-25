-- create new table
CREATE TABLE test.website_event_new
(
    website_id UUID,
    session_id UUID,
    visit_id UUID,
    event_id UUID,
    hostname LowCardinality(String),
    browser LowCardinality(String),
    os LowCardinality(String),
    device LowCardinality(String),
    screen LowCardinality(String),
    language LowCardinality(String),
    country LowCardinality(String),
    subdivision1 LowCardinality(String),
    subdivision2 LowCardinality(String),
    city String,
    url_path String,
    url_query String,
    referrer_path String,
    referrer_query String,
    referrer_domain String,
    page_title String,
    event_type UInt32,
    event_name String,
    created_at DateTime('UTC'),
    job_id UUID
)
    engine = MergeTree
        ORDER BY (website_id, session_id, created_at)
        SETTINGS index_granularity = 8192;

INSERT INTO test.website_event_new
SELECT we.website_id,
    we.session_id,
    we2.visit_id,
    we.event_id,
    we.hostname,
    we.browser,
    we.os,
    we.device,
    we.screen,
    we.language,
    we.country,
    we.subdivision1,
    we.subdivision2,
    we.city,
    we.url_path,
    we.url_query,
    we.referrer_path,
    we.referrer_query,
    we.referrer_domain,
    we.page_title,
    we.event_type,
    we.event_name,
    we.created_at,
    we.job_id
FROM test.website_event we
JOIN (SELECT DISTINCT
    s.session_id,
    generateUUIDv4() visit_id,
    s.created_at
FROM (SELECT DISTINCT session_id,
        date_trunc('hour', created_at) created_at
    FROM test.website_event) s) we2
    ON we.session_id = we2.session_id
        and date_trunc('hour', we.created_at) = we2.created_at
ORDER BY we.session_id, we.created_at

RENAME TABLE test.website_event TO test.website_event_old;
RENAME TABLE test.website_event_new TO test.website_event;