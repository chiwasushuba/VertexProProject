CREATE DATABASE vertexpro;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users_profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female')),

    birthdate DATE NOT NULL,
    address TEXT,
    contact_num VARCHAR(15),
    gcash_num VARCHAR(15),
    gcash_name TEXT,
    tin_num VARCHAR(20),

    job_title_id INTEGER REFERENCES job_titles(id),
    valid_id_id INTEGER REFERENCES valid_ids(id)
);


CREATE TABLE job_titles (
    id SERIAL PRIMARY KEY,
    title_name TEXT UNIQUE NOT NULL
);

CREATE TABLE valid_ids (
    id SERIAL PRIMARY KEY,
    id_type TEXT UNIQUE NOT NULL
);

CREATE TABLE user_documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT,
    document_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

