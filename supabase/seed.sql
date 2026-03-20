-- OmniMarketing AI -- Seed Data

-- CLIENTS
insert into public.clients (id, name, email, phone, avatar_url, status, health, instagram, city, state, contact_name, notes, joined_at)
values
  ('c1000000-0000-0000-0000-000000000001', 'Fialho Motors', 'contato@fialhomotors.com.br', '(67) 99999-1234', 'https://picsum.photos/seed/fialho/100/100', 'active', 'green', '@fialhomotorscg', 'Campo Grande', 'MS', 'Jucilene', 'Concessionaria GWM. 8 posts/mes, 2 reels/mes.', '2026-03-10T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000002', 'Sorriso CG', 'contato@sorrisocg.com.br', '(67) 99888-5678', 'https://picsum.photos/seed/sorriso/100/100', 'active', 'yellow', '@sorrisocg', 'Campo Grande', 'MS', 'Dr. Marcos', 'Clinica odontologica. 6 posts/mes. Atrasado na entrega de fotos.', '2026-03-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000003', 'Bamaq Porsche', 'marketing@bamaqporsche.com.br', '(31) 97777-9012', 'https://picsum.photos/seed/bamaq/100/100', 'active', 'green', '@bamaqporsche', 'Belo Horizonte', 'MG', 'Ricardo', 'Concessionaria Porsche. 12 posts/mes, 4 reels, newsletter.', '2026-01-15T00:00:00Z');