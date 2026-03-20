# OmniMarketing AI -- Relatorio de Analise Completa

**Data:** 2026-03-19
**Prototipo:** React 19 + Vite + Tailwind 4 + Recharts + Framer Motion
**Arquivos:** 10 fonte (~1.800 linhas)

---

## PARTE 1: MAPA COMPETITIVO

### 1.1 Automacoes de Marketing

| Plataforma | Foco | Diferenciais |
|---|---|---|
| n8n | Workflow open-source | 400+ integracoes, drag-and-drop, self-host |
| Make (ex-Integromat) | No-code automation | Branches visuais, error handling nativo |
| Zapier | Integracao apps | 6000+ apps, AI actions |
| ManyChat | Chat IG/WhatsApp | Instagram DM, keyword triggers |
| ActiveCampaign | Marketing + CRM | Lead scoring, email sequences |
| HubSpot Marketing Hub | All-in-one | A/B testing, revenue attribution |

**Gaps no prototipo:** Sem drag-and-drop real, sem branches condicionais, sem templates, sem logs de execucao, sem error handling, sem metricas por automacao. Builder nao salva.

### 1.2 Agentes de IA

| Plataforma | Foco | Diferenciais |
|---|---|---|
| Botpress | Chatbot builder | RAG, multi-channel, handoff |
| Voiceflow | Conversational AI | Canvas visual, intents |
| Intercom Fin | Suporte AI | 50%+ resolucao automatica |
| Dify.ai | LLM apps | RAG pipeline visual, observability |
| Relevance AI | AI agents | Multi-agent system, tool-use |
| Tidio Lyro | AI chatbot e-commerce | Shopify integrado |

**Gaps:** Sem knowledge base real, sem analytics de conversas, sem handoff para humano, sem multi-canal, sem guardrails/safety. Playground retorna mock hardcoded.

### 1.3 Calendario Editorial

| Plataforma | Foco | Diferenciais |
|---|---|---|
| Mlabs | Social media BR | Aprovacao cliente, multi-rede |
| Hootsuite | Social management | Drag-drop, Canva integrado |
| Planable | Colaboracao | Aprovacao excelente, preview pixel-perfect |
| Buffer | Publishing | Simplicidade, analytics |
| Later | Visual planner | Grid IG, best time to post |

**Gaps:** Sem drag-drop entre datas, sem preview por plataforma, sem fluxo de aprovacao, sem publicacao automatica, sem criacao com IA, sem kanban view. Calendario e read-only.

### 1.4 CRM / Clientes

| Plataforma | Foco | Diferenciais |
|---|---|---|
| HubSpot CRM | CRM completo | Pipeline visual, tracking emails |
| Pipedrive | Vendas | Pipeline drag-drop, previsao receita |
| RD Station CRM | PMEs BR | WhatsApp integrado |
| Agendor | CRM brasileiro | Relacionamento, historico interacoes |
| Clientjoy | CRM agencias | Proposals + contratos + invoices |

**Gaps:** Sem pipeline de vendas, sem tags, sem timeline real, sem campos custom, sem health score, sem WhatsApp. Nao cria/edita/deleta clientes.

### 1.5 Contratos e Faturamento

| Plataforma | Foco | Diferenciais |
|---|---|---|
| PandaDoc | Docs + e-sign | Templates, analytics |
| DocuSign | E-signature | Padrao global |
| Proposify | Proposals agencias | Tracking, e-sign |
| Bonsai | Agency toolkit | Contratos + invoices + time tracking |
| Conta Azul (BR) | ERP PMEs | NF-e, boletos |

**Gaps:** Sem templates editaveis, sem assinatura digital, sem tracking de visualizacao, sem faturas, sem PDF real. Preview estatico.

### 1.6 Dashboard

**Gaps:** Sem filtro periodo, sem filtro cliente, sem widgets custom, sem drill-down, sem comparativos, sem alertas.

---

## PARTE 2: AUDITORIA TECNICA

### 2.1 Botoes Mortos (54 total)

- **App.tsx:** 1 morto (Floating Chat Button L63-85)
- **Navigation.tsx:** 5 mortos (Configuracoes L103, Busca L127, Sino L134, Avatar L138, Breadcrumb L118)
- **Dashboard.tsx:** 3 mortos (Stat Cards L83 sem drill-down, Ver Log L218, Feed items L197)
- **Calendar.tsx:** 5 mortos + 1 parcial (Filtros L117, Novo Post header L121, Novo Post modal L300, Criar Post L288, MoreVertical L277, Toggle Grid/List L94 PARCIAL)
- **Automations.tsx:** 10 mortos (Edit L342, Delete L345, Play/Pause L349, Salvar Rascunho L96, Publicar Fluxo L99, 6x Biblioteca Passos L114, Settings step L190, Trash step L193, + step L217, Canvas zoom L226)
- **Agents.tsx:** 9 mortos + 2 parciais (+ agente L291, Settings L347, Refresh L350, Webhook L423, Logs L96, Salvar Treinamento L100, Limpar Chat L164, Adicionar Fonte L149, Refresh fonte L145, Temperatura L125 PARCIAL, Chat playground L65 PARCIAL)
- **Contracts.tsx:** 8 mortos (Compartilhar L85, Imprimir L88, Baixar PDF L91, Eye L329, Download L332, Reenviar Link L201, Ver Logs L204, Anular Contrato L207)
- **Clients.tsx:** 9 mortos + 1 parcial (Filtros L311, Novo Cliente L315, Email L377, Link L380, More L383, Novo Projeto L113, More perfil L110, Enviar Email L214, Ver todos L150, Notas Internas L222 PARCIAL)

**TOTAL: 50 completamente mortos. 4 parcialmente funcionais.**

### 2.2 Telas Faltando

| # | Tela | Impacto |
|---|---|---|
| 1 | Settings/Configuracoes | ALTO |
| 2 | Perfil do Usuario | MEDIO |
| 3 | Notificacoes | MEDIO |
| 4 | Formulario criacao de post | CRITICO |
| 5 | Formulario criacao de cliente | ALTO |
| 6 | Formulario criacao de agente | ALTO |
| 7 | Formulario criacao de contrato | ALTO |
| 8 | Logs expandidos | MEDIO |
| 9 | Pipeline de vendas (Kanban) | CRITICO |
| 10 | Relatorios/Analytics | ALTO |
| 11 | Integracoes redes sociais | ALTO |
| 12 | Chat IA global (assistente) | MEDIO |

### 2.3 Inconsistencias de Design

1. CTAs inconsistentes -- Novo Cliente branco, Novo Post verde. Padronizar emerald-500.
2. Cards de stats com 3 layouts diferentes entre modulos.
3. Breadcrumb estatico -- Projeto Alpha > Instagram Growth nunca muda.
4. Nome Gooom Admin hardcoded no header.
5. Branding inconsistente -- Header: Gooom Admin, Contratos: AGENCIA AI PRO.
6. Datas de contratos em 2024, app roda em 2026.
7. Slider de temperatura sem valor numerico visivel.
8. Sidebar sem versao mobile (drawer).

---

## PARTE 3: DEBATES ENTRE ESPECIALISTAS

### Debate 1: Builder de Automacoes -- Canvas 2D ou Lista Linear?

**Architect:** Feature mais complexa tecnicamente. Canvas 2D com @xyflow/react. 80-120 horas de dev frontend. Planejar com cuidado.

**Analyst:** ManyChat cresceu explosivamente com flows SIMPLES lineares. Agencias pequenas/medias nao precisam de n8n-level complexity. Comecar linear.

**Product Manager:** MVP: flows lineares que realmente salvam e executam. V2: branches. Reduz risco de over-engineering.

**Developer:** Usar @xyflow/react desde o inicio e mais inteligente. A lib ja resolve drag-and-drop, zoom, pan, conexoes. Migrar de lista vertical para canvas 2D depois e mais caro do que fazer certo desde o inicio.

**RESOLUCAO:** Implementar com @xyflow/react desde o inicio mas comecar com layout vertical simples (o que ja existe visualmente). A lib suporta ambos. Depois habilitar drag-and-drop 2D como upgrade.

### Debate 2: Modulo de Contratos -- Build ou Integrar?

**Analyst:** Nenhuma plataforma de marketing automation tem modulo de contratos integrado. Feature de nicho para agencias.

**Architect:** Reproduzir PandaDoc/DocuSign internamente e buraco negro de escopo. Assinatura digital juridica requer certificacao. Sugiro integracao via API.

**Product Manager:** Para agencias, ter contrato + CRM + automacoes integrados e diferencial competitivo real. Clientjoy faz exatamente isso e e bem-sucedida. Mas concordo que assinatura digital propria e insustentavel.

**Developer:** O preview visual de contrato e lindo. Manter como proposta comercial com template editavel. Assinatura via DocuSign API. Faturamento via Stripe/gateway BR.

**RESOLUCAO:** Manter modulo mas reposicionar como Propostas e Contratos. Focar em: (1) templates editaveis, (2) envio com tracking de visualizacao, (3) integracao com provider de e-signature, (4) faturas simples. NAO construir assinatura digital propria.

### Debate 3: O que implementar primeiro?

**Analyst:** Os dois maiores gaps: (1) Nenhum formulario de criacao funciona. (2) Nenhuma acao funciona. Prototipo bonito mas inerte nao retem usuario.

**Architect:** A arquitetura de estado e o problema raiz. O app nao tem state management. Todos os dados sao constantes hardcoded. Sem store, nada pode funcionar. Essa e a precondicao para tudo.

**Developer:** Zustand por simplicidade. Stores por dominio: useClientsStore, useAutomationsStore, useContractsStore, useAgentsStore, useCalendarStore. Com localStorage para persistencia sem backend.

**RESOLUCAO:** Ordem clara: (1) State management com Zustand + localStorage, (2) CRUD funcional para cada modulo, (3) Features novas.

### Debate 4: Modulo de Relatorios -- Novo modulo ou expandir Dashboard?

**Analyst:** Todo concorrente serio (HubSpot, Mlabs, Hootsuite) tem relatorios separados do dashboard. Dashboard = resumo rapido. Relatorios = deep-dive com filtros, comparativos, exportacao.

**Product Manager:** Para agencias, relatorios sao o PRODUTO que entregam ao cliente. Um relatorio bonito e automatizado e diferencial competitivo direto.

**Architect:** Tecnicamente, relatorios consomem dados cross-module. E um read-only cross-module. Pode ser implementado incrementalmente.

**RESOLUCAO:** Criar modulo Relatorios na sidebar. Comeca com relatorios pre-definidos por cliente com exportacao PDF. Depois evolui para customizaveis.

---

## PARTE 4: RECOMENDACOES PRIORIZADAS

### CRITICA (Sprint 1)
| # | Acao | Complexidade |
|---|---|---|
| 1 | State management Zustand + localStorage | Media |
| 2 | CRUD Clientes (criar, editar, deletar) | Baixa |
| 3 | CRUD Posts Calendario | Media |
| 4 | Sidebar responsiva mobile | Baixa |

### ALTA (Sprint 2)
| # | Acao | Complexidade |
|---|---|---|
| 5 | Tela de Settings | Media |
| 6 | Builder automacao com @xyflow/react | Alta |
| 7 | Chat agente com Gemini API real | Media |
| 8 | Criacao contrato/proposta com template | Media |
| 9 | Fluxo aprovacao no calendario | Media |

### MEDIA (Sprint 3)
| # | Acao | Complexidade |
|---|---|---|
| 10 | Painel de Notificacoes | Media |
| 11 | Busca global funcional | Media |
| 12 | Modulo de Relatorios (novo) | Alta |
| 13 | Dashboard com filtros periodo/cliente | Media |
| 14 | Knowledge base funcional para agentes | Alta |
| 15 | Drag-and-drop de posts no calendario | Media |

### BAIXA (Backlog)
| # | Acao | Complexidade |
|---|---|---|
| 16 | Integracao APIs redes sociais (requer backend) | Alta |
| 17 | Assinatura digital (integracao DocuSign) | Alta |
| 18 | Multi-idioma | Baixa |
| 19 | Dark/Light mode toggle | Baixa |
| 20 | PWA / App mobile | Media |

---

## PARTE 5: DECISOES PENDENTES (Gabriel precisa definir)

1. **Escopo do produto:** Plataforma para agencias de marketing (multi-tenant, ver dados de multiplos clientes) ou para qualquer negocio (simples, single-tenant)? Os competidores sao completamente diferentes dependendo da resposta.

2. **Backend stack:** O package.json inclui @google/genai e express mas nao usa nenhum dos dois. Quando backend for necessario: Supabase (consistente com ecossistema AIOX), Firebase, ou custom? Recomendacao: Supabase por consistencia.

3. **Monetizacao:** Per-seat? Per-client? Per-automation? Impacta arquitetura (limites, quotas, billing). Definir antes de implementar backend.

4. **IA como diferencial ou commodity:** IA e commodity em 2026. O diferencial real pode ser a integracao entre modulos (automacao que dispara agente que gera post que aparece no calendario que gera contrato). A inteligencia esta na orquestracao, nao na IA em si. Considerar reposicionar o diferencial.

---

## PARTE 6: PROXIMOS PASSOS CONCRETOS

### Amanha de manha
1. Rodar o app (npm install, npm run dev)
2. git init + commit inicial
3. npm install zustand
4. Criar src/stores/ (useClientsStore, useCalendarStore, useAutomationsStore, useAgentsStore, useContractsStore, useAppStore)
5. Primeiro CRUD: Clientes (mover dados para store, modal criacao, edicao, delecao, persistencia localStorage)
6. Segundo CRUD: Posts calendario (modal criacao com campos: titulo, plataforma, tipo, data/hora, cliente)

### Semana 1
- Dia 1-2: State management + CRUD Clientes + CRUD Calendar
- Dia 3: CRUD Contratos + CRUD Agentes (formularios de criacao)
- Dia 4: Settings page + Notificacoes + Busca global
- Dia 5: Builder @xyflow/react (setup basico)
- Dia 6-7: Polimento, testes, responsividade mobile

### Semanas 2-3
- Semana 2: Builder completo + Chat Gemini API
- Semana 3: Relatorios + Aprovacao calendario + Pipeline vendas

---

## ANEXO: Stack Recomendada (Frontend Only)

| Necessidade | Solucao | Motivo |
|---|---|---|
| State management | **Zustand** | Simples, sem boilerplate, localStorage nativo |
| Builder automacao | **@xyflow/react** (ex-reactflow) | Padrao mercado, gratuito |
| Formularios | **React Hook Form + Zod** | Validacao type-safe, performance |
| Tabelas | **TanStack Table** | Sorting, filtering, pagination |
| Toasts | **Sonner** | Leve, bonito |
| Date picker | **react-day-picker** | Customizavel |
| PDF generation | **@react-pdf/renderer** | Frontend-only |
| Rich text | **Tiptap** | WYSIWYG para templates contrato |

---

*Relatorio gerado em 2026-03-19 pelo squad OmniMarketing AI Analysis.*
*Perspectivas: Analyst (pesquisa competitiva), Architect (viabilidade tecnica), Product Manager (priorizacao), Developer (complexidade), UX (auditoria de fluxos).*