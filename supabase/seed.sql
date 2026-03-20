-- OmniMarketing AI -- Seed Data

-- CLIENTS
INSERT INTO public.clients (id, name, email, phone, avatar_url, status, health, instagram, city, state, contact_name, notes, joined_at)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Fialho Motors', 'contato@fialhomotors.com.br', '(67) 99999-1234', 'https://picsum.photos/seed/fialho/100/100', 'active', 'green', '@fialhomotorscg', 'Campo Grande', 'MS', 'Jucilene', 'Concessionaria GWM. 8 posts/mes, 2 reels/mes.', '2026-03-10T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000002', 'Sorriso CG', 'contato@sorrisocg.com.br', '(67) 99888-5678', 'https://picsum.photos/seed/sorriso/100/100', 'active', 'yellow', '@sorrisocg', 'Campo Grande', 'MS', 'Dr. Marcos', 'Clinica odontologica. 6 posts/mes. Atrasado na entrega de fotos.', '2026-03-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000003', 'Bamaq Porsche', 'marketing@bamaqporsche.com.br', '(31) 97777-9012', 'https://picsum.photos/seed/bamaq/100/100', 'active', 'green', '@bamaqporsche', 'Belo Horizonte', 'MG', 'Ricardo', 'Concessionaria Porsche. 12 posts/mes, 4 reels, newsletter.', '2026-01-15T00:00:00Z');

-- CONTRACTS
INSERT INTO public.contracts (id, client_id, service, amount, start_date, end_date, status, description, terms)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Social Media + WhatsApp Marketing', 1200.00, '2026-03-10', '2027-03-10', 'signed', 'Gerenciamento de redes sociais e automacao de WhatsApp para concessionaria GWM.', 'Vigencia de 12 meses com renovacao automatica. 8 posts/mes + 2 reels + banco de mensagens WhatsApp.'),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Social Media Basico', 800.00, '2026-03-01', '2026-09-01', 'signed', 'Gerenciamento de Instagram e WhatsApp para clinica odontologica.', 'Vigencia de 6 meses. 6 posts/mes + stories diarios + lembretes WhatsApp.'),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Full Marketing Stack Premium', 3500.00, '2026-01-15', '2027-01-15', 'signed', 'Pacote completo de marketing digital para concessionaria Porsche.', 'Vigencia de 12 meses. 12 posts/mes + 4 reels + newsletter quinzenal + lead scoring + relatorios semanais.');

-- AUTOMATIONS
INSERT INTO public.automations (id, client_id, name, type, status, description, last_run, runs_count, success_rate)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'WhatsApp Bom Dia', 'whatsapp', 'active', 'Envia mensagem motivacional diaria via Make.com para lista de clientes da Fialho.', '2026-03-19T07:00:00Z', 342, 99.10),
  ('a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Agendamento de Posts Meta', 'instagram', 'active', 'Publica posts automaticamente via Meta Business Suite nos horarios otimizados.', '2026-03-18T18:00:00Z', 64, 98.50),
  ('a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Lembrete de Consulta WhatsApp', 'whatsapp', 'active', 'Envia lembrete automatico 24h antes da consulta para pacientes do Sorriso CG.', '2026-03-19T08:00:00Z', 189, 97.80),
  ('a1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000003', 'WhatsApp VIP Bamaq', 'whatsapp', 'active', 'Mensagens exclusivas para clientes VIP Porsche com novidades e convites.', '2026-03-19T09:00:00Z', 156, 99.50),
  ('a1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003', 'Email Nurture Sequence', 'general', 'active', 'Sequencia de 5 emails para leads que demonstraram interesse em modelos Porsche.', '2026-03-18T14:00:00Z', 87, 94.20),
  ('a1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003', 'Lead Scoring Automatico', 'general', 'active', 'Pontua leads baseado em interacoes: visita site (+5), abre email (+3), clica WhatsApp (+10).', '2026-03-19T06:00:00Z', 412, 96.30),
  ('a1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'Relatorio Semanal Automatico', 'general', 'active', 'Gera e envia relatorio de performance semanal para Ricardo toda segunda-feira.', '2026-03-17T08:00:00Z', 10, 100.00);

-- AGENTS
INSERT INTO public.agents (id, client_id, name, role, context, status, model, accuracy, tokens_used, temperature, sources)
VALUES
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Copywriter Fialho', 'Copywriter Social', 'Especialista em conteudo para concessionaria GWM. Tom profissional mas acessivel. Foco em SUVs Haval e picapes Poer. Publico: familias e aventureiros de Campo Grande.', 'online', 'Gemini 3 Flash', 92.50, 34200, 0.7, '["https://fialhomotors.com.br", "https://gwmmotors.com.br"]'),
  ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Estrategista Fialho', 'Content Strategist', 'Define calendario editorial e pilares de conteudo para Fialho Motors. Conhece mercado automotivo de MS e concorrentes locais.', 'online', 'Gemini 3 Pro', 88.00, 12800, 0.5, '["https://fialhomotors.com.br"]'),
  ('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Copywriter Sorriso', 'Copywriter Social', 'Cria conteudo para clinica odontologica. Tom acolhedor e educativo. Foco em estetica dental, implantes e prevencao.', 'online', 'Gemini 3 Flash', 90.00, 18500, 0.7, '["https://sorrisocg.com.br"]'),
  ('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'WhatsApp Sorriso', 'WhatsApp Specialist', 'Gerencia comunicacao via WhatsApp do Sorriso CG. Lembretes, confirmacoes, pos-consulta e campanhas sazonais.', 'offline', 'Gemini 3 Flash', 95.00, 8900, 0.3, '[]'),
  ('e1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003', 'Copywriter Bamaq', 'Copywriter Social', 'Conteudo premium para Porsche. Tom exclusivo e sofisticado. Foco em experiencia, performance e lifestyle.', 'online', 'Gemini 3 Pro', 94.00, 45600, 0.6, '["https://bamaqporsche.com.br", "https://porsche.com.br"]'),
  ('e1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003', 'Analista Bamaq', 'Market Analyst', 'Monitora concorrentes (BMW, Mercedes, Audi) em BH. Analisa tendencias de mercado de luxo e comportamento do publico.', 'online', 'Gemini 3 Pro', 87.00, 22300, 0.4, '["https://bmw.com.br", "https://mercedes-benz.com.br"]'),
  ('e1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'SEO Bamaq', 'SEO Auditor', 'Otimiza presenca digital da Bamaq Porsche. Keywords, meta tags, Google Meu Negocio, backlinks.', 'offline', 'Gemini 3 Flash', 91.00, 15700, 0.3, '["https://bamaqporsche.com.br"]'),
  ('e1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'Estrategista Bamaq', 'Content Strategist', 'Planeja conteudo premium para Porsche. Calendario com lancamentos, eventos exclusivos e lifestyle content.', 'online', 'Gemini 3 Pro', 89.00, 19800, 0.5, '["https://porsche.com.br/modelos"]');

-- CALENDAR POSTS (proximas 2 semanas para cada cliente)
INSERT INTO public.calendar_posts (id, client_id, title, platform, type, status, scheduled_at, content)
VALUES
  -- Fialho Motors
  ('f1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Haval H6: Conforto que sua familia merece', 'instagram', 'feed', 'approved', '2026-03-20T10:00:00Z', 'Descubra o SUV que combina espaco, tecnologia e seguranca.'),
  ('f1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Test Drive Gratuito - Fim de Semana', 'instagram', 'reel', 'scheduled', '2026-03-22T14:00:00Z', 'Venha conhecer a linha GWM. Agende seu test drive!'),
  ('f1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'GWM Poer: A picape que faltava em CG', 'instagram', 'feed', 'draft', '2026-03-24T10:00:00Z', 'Potencia e robustez para o dia a dia do campo-grandense.'),
  ('f1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Dicas de manutencao preventiva', 'instagram', 'carousel', 'draft', '2026-03-26T10:00:00Z', '5 dicas essenciais para manter seu GWM sempre novo.'),
  ('f1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Bastidores da concessionaria', 'instagram', 'reel', 'draft', '2026-03-28T16:00:00Z', 'Conheca nossa equipe e nosso espaco.'),
  -- Sorriso CG
  ('f1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Sorriso perfeito comeca com prevencao', 'instagram', 'feed', 'approved', '2026-03-20T11:00:00Z', 'Agende sua consulta de rotina e cuide do seu sorriso.'),
  ('f1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002', 'Antes e Depois: Lentes de Contato Dental', 'instagram', 'reel', 'scheduled', '2026-03-23T15:00:00Z', 'Transformacao real de paciente com lentes de porcelana.'),
  ('f1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000002', 'Mitos sobre clareamento dental', 'instagram', 'carousel', 'draft', '2026-03-25T11:00:00Z', 'Verdade ou mito? Descubra o que realmente funciona.'),
  ('f1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000002', 'Depoimento: Ana Paula - Implante', 'instagram', 'feed', 'draft', '2026-03-27T11:00:00Z', 'A experiencia da Ana Paula com implante no Sorriso CG.'),
  -- Bamaq Porsche
  ('f1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000003', 'Novo Cayenne 2026: Performance Redefinida', 'instagram', 'reel', 'approved', '2026-03-20T12:00:00Z', 'Conheca o novo Porsche Cayenne. Potencia e elegancia em cada detalhe.'),
  ('f1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000003', 'Porsche Experience Day - BH', 'instagram', 'feed', 'scheduled', '2026-03-21T10:00:00Z', 'Evento exclusivo para clientes. Viva a experiencia Porsche na pista.'),
  ('f1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000003', 'Macan: O SUV esportivo ideal', 'instagram', 'feed', 'scheduled', '2026-03-23T12:00:00Z', 'Design esportivo, desempenho incomparavel. Macan e Porsche em cada curva.'),
  ('f1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000003', '911 Carrera: Lenda viva', 'instagram', 'reel', 'draft', '2026-03-25T14:00:00Z', 'Mais de 60 anos de historia. O icone que nunca sai de moda.'),
  ('f1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000003', 'Newsletter: Mercado de Luxo em BH', 'website', 'blog', 'draft', '2026-03-26T08:00:00Z', 'Tendencias do mercado automotivo de luxo em Belo Horizonte.'),
  ('f1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000003', 'Taycan: O futuro e eletrico', 'instagram', 'reel', 'draft', '2026-03-28T12:00:00Z', 'Performance 100% eletrica. Taycan: a evolucao da esportividade.');

-- PIPELINE LEADS
INSERT INTO public.pipeline_leads (id, client_id, name, value, stage, contact, last_contact, source)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Carlos Mendes', 1200.00, 'qualified', '(67) 99123-4567', '2026-03-18T14:00:00Z', 'Instagram DM'),
  ('b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Maria Souza', 1200.00, 'proposal', '(67) 98765-4321', '2026-03-17T10:00:00Z', 'WhatsApp'),
  ('b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Fernanda Lima', 800.00, 'new', '(67) 99555-1234', '2026-03-19T09:00:00Z', 'Google'),
  ('b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000003', 'Eduardo Almeida', 3500.00, 'negotiation', '(31) 99876-5432', '2026-03-18T16:00:00Z', 'Evento Presencial'),
  ('b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003', 'Patricia Rocha', 3500.00, 'closed', '(31) 97654-3210', '2026-03-15T11:00:00Z', 'Indicacao');

-- NOTIFICATIONS
INSERT INTO public.notifications (type, title, message, read, entity_type, created_at)
VALUES
  ('automation', 'WhatsApp Bom Dia executado', 'Automacao Fialho Motors: 45 mensagens enviadas com sucesso.', false, 'automation', '2026-03-19T07:05:00Z'),
  ('lead', 'Novo lead qualificado', 'Carlos Mendes demonstrou interesse no Haval H6 via Instagram DM.', false, 'lead', '2026-03-18T14:30:00Z'),
  ('contract', 'Contrato Bamaq renovado', 'Contrato Full Marketing Stack Premium renovado por mais 12 meses.', true, 'contract', '2026-03-15T10:00:00Z'),
  ('agent', 'Agente treinado com sucesso', 'Copywriter Fialho atualizado com novos dados do catalogo GWM 2026.', true, 'agent', '2026-03-14T16:00:00Z'),
  ('system', 'Backup automatico concluido', 'Todos os dados exportados com sucesso para storage.', true, 'system', '2026-03-13T03:00:00Z'),
  ('automation', 'Lembrete de Consulta enviado', 'Sorriso CG: 12 lembretes enviados para consultas de amanha.', false, 'automation', '2026-03-19T08:10:00Z'),
  ('lead', 'Lead em negociacao', 'Eduardo Almeida (Bamaq) solicitou proposta para Cayenne 2026.', false, 'lead', '2026-03-18T16:30:00Z'),
  ('automation', 'Lead Score atualizado', 'Bamaq: 3 leads subiram de pontuacao esta semana.', true, 'automation', '2026-03-17T06:15:00Z'),
  ('contract', 'Fatura gerada', 'Fatura de marco gerada para Sorriso CG: R$ 800,00.', false, 'contract', '2026-03-05T09:00:00Z'),
  ('system', 'Relatorio semanal pronto', 'Relatorio Bamaq Porsche semana 11 disponivel para download.', true, 'system', '2026-03-17T08:30:00Z');

-- ACTIVITY LOG
INSERT INTO public.activity_log (action, entity_type, details, created_at)
VALUES
  ('create', 'client', '{"name": "Fialho Motors", "by": "Gabriel"}', '2026-03-10T10:00:00Z'),
  ('create', 'contract', '{"client": "Fialho Motors", "amount": 1200, "by": "Gabriel"}', '2026-03-10T10:05:00Z'),
  ('create', 'client', '{"name": "Sorriso CG", "by": "Gabriel"}', '2026-03-01T09:00:00Z'),
  ('create', 'contract', '{"client": "Sorriso CG", "amount": 800, "by": "Gabriel"}', '2026-03-01T09:05:00Z'),
  ('create', 'client', '{"name": "Bamaq Porsche", "by": "Gabriel"}', '2026-01-15T14:00:00Z'),
  ('create', 'contract', '{"client": "Bamaq Porsche", "amount": 3500, "by": "Gabriel"}', '2026-01-15T14:05:00Z'),
  ('update', 'automation', '{"name": "WhatsApp Bom Dia", "action": "activated", "by": "Gabriel"}', '2026-03-11T08:00:00Z'),
  ('update', 'agent', '{"name": "Copywriter Fialho", "action": "trained", "by": "Gabriel"}', '2026-03-14T16:00:00Z'),
  ('create', 'post', '{"title": "Haval H6: Conforto que sua familia merece", "client": "Fialho Motors", "by": "Gabriel"}', '2026-03-18T11:00:00Z'),
  ('update', 'post', '{"title": "Haval H6", "action": "approved", "by": "Vitor"}', '2026-03-18T15:00:00Z'),
  ('create', 'lead', '{"name": "Carlos Mendes", "client": "Fialho Motors", "by": "System"}', '2026-03-18T14:00:00Z'),
  ('update', 'lead', '{"name": "Eduardo Almeida", "stage": "negotiation", "by": "Gabriel"}', '2026-03-18T16:30:00Z'),
  ('create', 'post', '{"title": "Novo Cayenne 2026", "client": "Bamaq Porsche", "by": "Gabriel"}', '2026-03-19T09:00:00Z'),
  ('update', 'automation', '{"name": "Email Nurture Sequence", "action": "activated", "by": "Gabriel"}', '2026-03-12T10:00:00Z'),
  ('create', 'post', '{"title": "Sorriso perfeito", "client": "Sorriso CG", "by": "Gabriel"}', '2026-03-19T10:00:00Z');
