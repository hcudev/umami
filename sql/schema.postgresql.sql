create table website (
    website_id uuid primary key,
    hostname varchar(100) unique not null,
    created_at timestamp with time zone default current_timestamp
);

create table session (
    session_id uuid primary key,
    website_id uuid references website(website_id) on delete cascade,
    created_at timestamp with time zone default current_timestamp,
    hostname varchar(100),
    browser varchar(20),
    os varchar(20),
    screen varchar(11),
    language varchar(35),
    country char(2)
);

create table pageview (
    view_id serial primary key,
    session_id uuid references session(session_id) on delete cascade,
    created_at timestamp with time zone default current_timestamp,
    url varchar(500) not null,
    referrer varchar(500)
);

create table event (
    event_id serial primary key,
    session_id uuid references session(session_id) on delete cascade,
    created_at timestamp with time zone default current_timestamp,
    url varchar(500) not null,
    event_type varchar(50) not null,
    event_value varchar(255) not null
);

create index on session(created_at);
create index on pageview(created_at);
create index on event(created_at);