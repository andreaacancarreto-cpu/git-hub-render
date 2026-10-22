-- script que se corre en DBeaver (base de datos de render)
-- crea las tablas roles, usuarios y estudiantes

CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES public.roles(id),
    fecha_creacion TIMESTAMP DEFAULT now()
);

-- roles que usa el registro (rol_id 1 = admin, 2 = usuario)
-- sin esto no se puede registrar ningun usuario por la llave foranea
INSERT INTO public.roles (nombre) VALUES ('admin'), ('usuario')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.estudiantes (
    id SERIAL PRIMARY KEY,
    carnet VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    carrera VARCHAR(100),
    promedio NUMERIC(4,2) DEFAULT 0
);
