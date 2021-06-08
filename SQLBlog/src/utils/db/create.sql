DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;

CREATE TABLE
    IF NOT EXISTS
        blogs (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            category VARCHAR ( 50 ) NOT NULL,
            title VARCHAR ( 50 ) NOT NULL,
            cover VARCHAR ( 50 ) NOT NULL,
            read_time_value INTEGER NOT NULL,
            read_time_unit VARCHAR ( 50 ) NOT NULL,
            author INTEGER REFERENCES authors ON DELETE CASCADE,
            content VARCHAR ( 2000 ) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW() 
        );

CREATE TABLE
	IF NOT EXISTS
		authors (
			id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			name VARCHAR ( 50 ) NOT NULL,
			surname VARCHAR ( 50 ) NOT NULL,
			avatar VARCHAR ( 50 ) NOT NULL,
			created_at TIMESTAMPTZ DEFAULT NOW()
		);