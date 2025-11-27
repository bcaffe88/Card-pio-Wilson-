create table public.horarios_funcionamento (
  id uuid not null default extensions.uuid_generate_v4 (),
  dia_semana text not null, -- 'Segunda', 'Terça', etc. ou 0-6
  abertura time not null,
  fechamento time not null,
  aberto boolean default true,
  created_at timestamp with time zone null default now(),
  constraint horarios_pkey primary key (id)
) TABLESPACE pg_default;

-- Exemplo de dados iniciais
-- INSERT INTO public.horarios_funcionamento (dia_semana, abertura, fechamento) VALUES
-- ('Segunda', '10:00', '23:00'),
-- ('Terça', '10:00', '23:00'),
-- ('Quarta', '10:00', '23:00'),
-- ('Quinta', '10:00', '23:00'),
-- ('Sexta', '10:00', '00:00'),
-- ('Sábado', '10:00', '00:00'),
-- ('Domingo', '10:00', '00:00');
