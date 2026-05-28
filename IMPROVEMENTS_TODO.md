# TaskFlow — TODO de Melhorias (workflow multi-sessão)

> Cada item é uma **unidade de trabalho para UMA sessão de chat**. Faz-se um item, valida-se, faz-se commit, e abre-se uma **nova sessão** para o item seguinte. Objetivo: manter o contexto de cada sessão curto e focado para evitar drift/alucinações.

---

## Como usar (protocolo por sessão)

**Branch de trabalho:** todo o trabalho desta lista vai para a branch **`development`**; o `master` fica estável. Cada item termina com commit + push em `development`. Integração para `master` faz-se por PR quando quiseres.

**No início de cada nova sessão, cola este prompt:**

> "Trabalha na branch `development` (`git checkout development && git pull`). Lê o `IMPROVEMENTS_TODO.md`, encontra o **primeiro item `[ ]` não concluído** e executa **apenas esse**. No fim: corre os comandos da secção *Validar*, marca o item como `[x]`, faz commit e push para `development`. Não avances para o item seguinte."

**Regras (anti-alucinação) — respeitar sempre:**
1. **Um item por sessão.** Nunca encadear itens. Se sobrar tempo, pára.
2. **Validar a sério.** Correr mesmo os comandos da secção *Validar* e ler o output; não declarar sucesso sem ver verde.
3. **Terminar verde + commit + push.** Cada sessão acaba com build/testes a passar e um commit+push em `development`. O próximo arranque parte de estado limpo e conhecido.
4. **Não alargar o âmbito.** Tocar só nos ficheiros listados. Se descobrires trabalho extra, **anota-o** num novo item no fim deste ficheiro em vez de o fazeres agora.
5. **Em caso de dúvida de design, pergunta** antes de inventar (sobretudo Step 3.1).

**Contexto / porquê de cada item:** ver a revisão completa em `~/.claude/plans/aja-como-um-senior-serene-cosmos.md`. O CLAUDE.md já dá o contexto geral do projeto a qualquer sessão nova.

**Ordem:** Fases 0→1→2 são sequenciais e obrigatórias por dependência (rede → testes → refactor). Fases 3–6 são largamente independentes; podem ser reordenadas ou saltadas conforme o objetivo.

---

## Fase 0 — Rede de segurança (fazer primeiro; protege tudo o resto)

### [x] Step 0.0 — Baseline verde
- **Objetivo:** confirmar o ponto de partida antes de mexer em nada.
- **Ficheiros:** nenhum (só correr comandos).
- **Fazer:** `npm run install:all`; `npm run build`; correr os testes de cada pacote. Registar no fim deste ficheiro (secção *Notas*) que testes passam/falham hoje.
- **Pronto quando:** sei exatamente o estado atual (verde ou que falha).
- **Validar:** `npm run build` && `cd command-task-core && npm test` && `cd ../backend && npm test`

### [x] Step 0.0.1 — Corrigir testes do backend (pré-requisito do 0.1)
- **Objetivo:** fazer o `cd backend && npm test` ficar verde antes de criar o runner da raiz.
- **Ficheiros:** `backend/jest.config.js`, `backend/src/repositories/__mocks__/task.repository.ts`, `backend/src/services/task.service.spec.ts`.
- **Fazer:**
  1. `jest.config.js`: substituir `testPathIgnorePatterns` por `roots: ["<rootDir>/src"]` para o jest-haste-map não ver `backend/dist/` (causava "duplicate manual mock").
  2. Mock manual: adicionar `findDuplicate = jest.fn()` (e `findDueOnDate = jest.fn()`) em falta.
  3. Spec: substituir `repository.findDueOnDate.mockResolvedValue(…)` por `repository.findDuplicate.mockResolvedValue(…)` nos dois testes (o serviço chama `findDuplicate`, não `findDueOnDate` — spec estava desatualizado).
- **Pronto quando:** `cd backend && npm test` → 2/2 verdes.
- **Validar:** `cd backend && npm test`

### [x] Step 0.1 — Test runner na raiz
- **Objetivo:** um único comando corre os testes de todos os pacotes.
- **Ficheiros:** `package.json` (raiz).
- **Fazer:** adicionar script `"test": "npm test --prefix command-task-core && npm test --prefix backend"` (incluir frontend só depois de ter testes — Step 5.4). Não alterar os testes em si.
- **Pronto quando:** `npm test` na raiz corre core + backend.
- **Validar:** `npm test`

### [x] Step 0.2 — ESLint no backend e no core
- **Objetivo:** lint nos 3 pacotes (o frontend já tem).
- **Ficheiros:** `backend/` e `command-task-core/` (novo `eslint.config.js` em cada); `package.json` (raiz, script `lint`).
- **Fazer:** configurar ESLint + `@typescript-eslint` em backend e core, alinhado com o do frontend. Corrigir/triar erros óbvios (não fazer refactors grandes — se um erro exigir mudança de lógica, suprimir com comentário e anotar como item novo). Adicionar `"lint"` na raiz a correr os 3.
- **Pronto quando:** `npm run lint` na raiz passa nos 3 pacotes.
- **Validar:** `npm run lint`

### [x] Step 0.3 — CI (GitHub Actions)
- **Objetivo:** cada push/PR corre install + build + lint + testes.
- **Ficheiros:** `.github/workflows/ci.yml` (novo).
- **Fazer:** workflow em Node LTS: `npm run install:all`, `npm run build`, `npm run lint`, `npm test`. Sem deploy.
- **Pronto quando:** o workflow existe e os passos correspondem aos comandos que passam localmente.
- **Validar:** `npx --yes @action-validator/cli .github/workflows/ci.yml` (ou rever YAML à mão) + confirmar que os comandos passam localmente.

---

## Fase 1 — Travar o core com testes ANTES de refatorar

> O `interpret()` (`command-task-core/src/core/index.ts`, ~772 linhas) é o coração do produto e não tem testes. Estes são **testes de caracterização**: capturam o comportamento ATUAL para o refactor da Fase 2 ser seguro. Se algo parecer um bug, **não corrigir aqui** — testar como está e anotar.

### [x] Step 1.1 — Testes de input fresco / single-turn
- **Objetivo:** cobrir a deteção de intent que devolve QUESTION ou FINAL à primeira.
- **Ficheiros:** novo `command-task-core/src/core/index.spec.ts`. Ler `index.ts`, `pipeline/runPipeline.ts`, `intent/detector.ts`.
- **Fazer:** testar `interpret(texto, initialState)` para: criar com tudo ("add buy milk tomorrow at 3pm" → FINAL CREATE_TASK), criar incompleto ("add buy milk" → QUESTION), listar, deteção de delete/edit. Asserções sobre `result.type` e intent/slots.
- **Pronto quando:** ≥8 casos a passar, refletindo o comportamento atual.
- **Validar:** `cd command-task-core && npm test`

### [x] Step 1.2 — Testes dos fluxos multi-turno (state machine)
- **Objetivo:** cobrir as continuações de conversa (a parte mais frágil).
- **Ficheiros:** `command-task-core/src/core/index.spec.ts` (continuar). Ler os blocos de continuação em `index.ts` e `state/types.ts`.
- **Fazer:** testar, encadeando o `state` devolvido: slot-filling de CREATE (title→date→time), fluxo de edição ("what to change?" → campo), disambiguação de delete, confirmação de delete-all, slot opcional de hora. Verificar transições de `state` e a resposta final.
- **Pronto quando:** cada fluxo multi-turno tem ≥1 teste ponta-a-ponta verde.
- **Validar:** `cd command-task-core && npm test`

### [x] Step 1.3 — Testes do chit-chat e dos extractors em falta
- **Objetivo:** fechar as lacunas de cobertura antes do refactor.
- **Ficheiros:** novos specs para `slots/priority.ts`, `slots/description.ts`, `slots/recurrence.ts`; casos para `getConversationalResponse()` (em `index.ts`).
- **Fazer:** ≥2 casos por extractor; para o chit-chat, cobrir as famílias principais (identidade, ajuda, saudação, agradecimento, piada). Para respostas aleatórias (piadas), testar que devolve algo do conjunto esperado.
- **Pronto quando:** os 3 extractors e as famílias de chit-chat têm testes verdes.
- **Validar:** `cd command-task-core && npm test`

---

## Fase 2 — Refactor seguro do core (testes da Fase 1 têm de ficar verdes)

### [x] Step 2.1 — Extrair a camada de chit-chat
- **Objetivo:** tirar 172 linhas hardcoded de dentro de `index.ts`.
- **Ficheiros:** novo `command-task-core/src/core/conversational/` (ex.: `patterns.ts` + `responses.ts` + `index.ts`); editar `index.ts` para delegar.
- **Fazer:** mover `getConversationalResponse()` para o módulo, **separando padrões (regex) dos textos** (mapa `chave→texto`). Comportamento idêntico.
- **Pronto quando:** `index.ts` deixa de conter os textos; testes da Fase 1 verdes.
- **Validar:** `cd command-task-core && npm test`

### [x] Step 2.2 — Extrair o fluxo de edição
- **Objetivo:** isolar o maior sub-fluxo (~225 linhas) de `interpret()`.
- **Ficheiros:** novo `command-task-core/src/core/flows/editFlow.ts`; editar `index.ts`.
- **Fazer:** mover a lógica do fluxo de edição para `handleEditFlow(input, state)` que devolve `{ result, state }`. `interpret()` passa a delegar quando está nesse estado. Sem mudança de comportamento.
- **Pronto quando:** `index.ts` mais curto; testes verdes.
- **Validar:** `cd command-task-core && npm test`

### [x] Step 2.3 — `ConversationState` como discriminated union
- **Objetivo:** eliminar as flags booleanas soltas que podem entrar em conflito.
- **Ficheiros:** `command-task-core/src/core/state/types.ts`, `state/stateManager.ts`, `index.ts`, `flows/editFlow.ts`.
- **Fazer:** substituir os vários `awaiting*: boolean` por um campo discriminado (`kind: "IDLE" | "AWAITING_SLOT" | "EDIT" | "PENDING_CONFIRMATION" | ...`) com os dados de cada estado. Migrar leituras/escritas. Ajustar testes que dependam da forma antiga do `state` (só a forma, não o comportamento observável).
- **Pronto quando:** sem flags booleanas paralelas; `tsc` e testes verdes.
- **Validar:** `cd command-task-core && npx tsc --noEmit && npm test`

### [x] Step 2.4 — Ligar a disambiguação de slot (`AMBIGUOUS_SLOT`)
- **Objetivo:** usar a deteção de ambiguidade que já existe mas é ignorada.
- **Ficheiros:** `command-task-core/src/core/ambiguity/checker.ts`, `pipeline/runPipeline.ts`, `index.ts`; novos testes.
- **Fazer:** quando um slot tem múltiplos valores, devolver QUESTION ("qual: 3pm ou 15h?") e tratar a resposta no turno seguinte. Adicionar testes do fluxo.
- **Pronto quando:** input com dois valores do mesmo slot gera pergunta; teste verde.
- **Validar:** `cd command-task-core && npm test`

---

## Fase 3 — Segurança (8 vulnerabilidades confirmadas por auditoria, 2026-05-27)

> **Conclusão da auditoria:** a segurança não está só sobre-engenheirada — está **partida**. Os cookies httpOnly são um no-op (o `authMiddleware` lê só o header `Authorization`, nunca `req.cookies`; e o login/register ainda devolvem `tokens` no body, que o frontend guarda em localStorage). Os 3 mecanismos de lockout/deteção são todos contornáveis. *Ou seja: complexidade sem proteção real* — a ilustração exata do problema central do projeto.
>
> Mapa file:line (fiável, vem de auditoria):
>
> | # | Ficheiro:linha | Problema | Tratado em |
> |---|---|---|---|
> | 1 | `backend/src/controllers/auth.controller.ts:105,170` + `middlewares/auth.middleware.ts:12` | Cookie httpOnly inerte: tokens no body + middleware ignora cookies | 3.1 |
> | 2 | `frontend/src/lib/auth.ts:43` | `fetch()` sem `credentials:'include'` → cookies nunca enviados/recebidos cross-origin | 3.1 |
> | 3 | `backend/src/controllers/auth.controller.ts:21` | `X-Forwarded-For` spoofável, sem `trust proxy` (afeta também o rate limiter) | 3.4 (sempre) |
> | 4 | `backend/src/controllers/auth.controller.ts:174` | Login com email desconhecido nunca é registado → lockout/deteção contornados | 3.3 (se manter) |
> | 5 | `backend/src/services/account-lockout.service.ts:41` | Race condition no incremento (2 writes, sem `$transaction`) | 3.3 (se manter) |
> | 6 | `backend/src/routes/auth.routes.ts:18` | `POST /refresh` sem `validate()` → input não validado em `jwt.verify` | 3.5 (sempre) |
> | 7 | `frontend/src/components/auth/RegisterPage.tsx:29` | Validação de password no cliente (<6) ≠ backend (8+ complexidade) | 3.6 (sempre) |
> | 8 | `backend/src/middlewares/https.middleware.ts:12` | Redirect HTTPS saltado quando `X-Forwarded-Proto` ausente → cleartext | 3.7 (sempre) |
>
> **Duas decisões moldam esta fase** (perguntar ao utilizador antes de codar): **3.1** = que modelo de tokens? · **3.3** = manter-e-endurecer ou remover o aparato de lockout/audit? Os passos 3.4–3.7 são **bugs a corrigir sempre**, independentes das decisões.
>
> Se a segurança for prioridade, esta fase pode vir logo a seguir à Fase 0 (queres a rede de testes/lint primeiro).

### [x] Step 3.1 — Modelo único de tokens (DECISÃO) — resolve #1 e #2
- **Objetivo:** um modelo coerente em vez de dois meios-modelos partidos.
- **Decisão:**
  - **(A, recomendado)** Refresh token só em cookie **httpOnly** (já está no path `/auth`); access token **em memória** no frontend (não localStorage), enviado via Bearer (o `authMiddleware` fica igual). Parar de devolver tokens no body; pôr `credentials:'include'` nos fetch (#2).
  - **(B, mais simples/honesto p/ aprendizagem)** Assumir tokens-no-body + localStorage e **remover todo o código de cookies** (`setTokenCookies`/`clearTokenCookies` e chamadas); documentar que o risco XSS é aceite. (#2 fica irrelevante.)
- **Ficheiros:** `backend/src/controllers/auth.controller.ts` (linhas 55–70, 100–106, 164–171, 237–238), `frontend/src/lib/auth.ts` (~43), `frontend/src/lib/api.ts`. (Nota: o `refreshController:228` já lê o cookie, logo o `cookie-parser` já está montado.)
- **Fazer:** implementar **só** o modelo escolhido, de ponta a ponta. Sem código do outro modelo a coexistir.
- **Pronto quando:** os tokens vivem **apenas** no sítio do modelo escolhido (verificar no DevTools → Application); login/refresh/logout funcionam; não há tokens duplicados em body+cookie.
- **Validar:** `npm run dev`, fazer login, inspecionar storage/cookies, forçar expiração do access e confirmar o refresh.

### [x] Step 3.2 — Fallback de secrets em dev
- **Objetivo:** a app não deve arrancar "a fingir" com secret falso fixo.
- **Ficheiros:** `backend/src/config/auth.config.ts`.
- **Fazer:** se faltar `JWT_SECRET`/`JWT_REFRESH_SECRET`, gerar random forte por arranque **ou** falhar com mensagem clara (em vez do `dev-…-not-for-production` fixo). Atualizar `.env.example` se preciso.
- **Pronto quando:** arrancar sem env de secret não produz um secret partilhado previsível.
- **Validar:** `cd backend && npm run dev` sem a env e observar o comportamento novo.

### [x] Step 3.3 — Manter-e-endurecer OU remover o aparato de lockout/audit (DECISÃO) — resolve #4 e #5
- **Objetivo:** decidir conscientemente o destino do lockout + audit logs + deteção de atividade suspeita (hoje contornáveis).
- **Decisão:**
  - **(MANTER)** Endurecer: também corrigir **#4** (registar tentativas falhadas mesmo com email desconhecido — tirar o guard `if (userForLockout)` em `auth.controller.ts:174`, registando por email/IP) **e #5** (envolver o incremento + lock num `prisma.$transaction` em `account-lockout.service.ts:41`). Documentar como exercício deliberado.
  - **(REMOVER, mais alinhado com projeto de aprendizagem)** Apagar `account-lockout.service.ts`, as chamadas em `auth.controller.ts` e o logging `SecurityLog`/`LoginAttempt`; fica só o rate limiter como defesa. #4 e #5 desaparecem com o código.
- **Ficheiros:** `backend/src/controllers/auth.controller.ts`, `backend/src/services/account-lockout.service.ts`, `backend/src/services/security-log.service.ts`, schema Prisma (se remover tabelas).
- **Pronto quando:** decisão aplicada; auth continua a funcionar; se MANTER, #4 e #5 corrigidos (com teste).
- **Validar:** `cd backend && npm test` e smoke de login (sucesso + falha + email inexistente).

### [ ] Step 3.4 — `trust proxy` + IP fiável (#3) — FAZER SEMPRE
- **Objetivo:** o IP usado em rate limiter / lockout / audit deixar de ser spoofável via header.
- **Ficheiros:** `backend/src/app.ts` (config Express), `backend/src/controllers/auth.controller.ts:21` (`getClientInfo`).
- **Fazer:** `app.set('trust proxy', <n.º de proxies à frente>)` adequado ao deploy, e derivar o IP de `req.ip` (que passa a respeitar o trust proxy) em vez de ler `x-forwarded-for` à mão. Corrige também o `express-rate-limit`, que sem isto partilha um único balde entre todos atrás do proxy.
- **Pronto quando:** o IP vem de `req.ip` com trust proxy configurado; não há leitura manual de `x-forwarded-for`.
- **Validar:** `cd backend && npm test` + smoke confirmando que o rate limiter conta por cliente.

### [ ] Step 3.5 — `validate()` no `POST /refresh` (#6) — FAZER SEMPRE
- **Objetivo:** validar o input antes de `jwt.verify`.
- **Ficheiros:** `backend/src/routes/auth.routes.ts:18` (aplicar middleware), `backend/src/validators/auth.validator.ts` (o `refreshTokenSchema` já existe).
- **Fazer:** aplicar `validate(refreshTokenSchema)` à rota `/refresh`, como nas outras rotas de auth.
- **Pronto quando:** body não-string/sobredimensionado é rejeitado com 400 antes do controller.
- **Validar:** `cd backend && npm test` (adicionar caso) + `curl` com `refreshToken: []`.

### [ ] Step 3.6 — Paridade de validação de password FE↔BE (#7) — FAZER SEMPRE
- **Objetivo:** o cliente espelhar a regra do backend (8+ com maiúscula, minúscula, dígito, especial).
- **Ficheiros:** `frontend/src/components/auth/RegisterPage.tsx:29` (e idealmente partilhar a regra via `shared/`).
- **Fazer:** substituir o gate de `length < 6` pela mesma regra do Zod do backend, com feedback inline por campo.
- **Pronto quando:** uma password que o backend rejeitaria mostra erro inline antes do submit.
- **Validar:** smoke no `npm run dev` com `abcdef1!` (sem maiúscula) → erro inline, sem 400 do servidor.

### [ ] Step 3.7 — Redirect HTTPS por omissão segura (#8) — FAZER SEMPRE
- **Objetivo:** não servir cleartext quando `X-Forwarded-Proto` está ausente.
- **Ficheiros:** `backend/src/middlewares/https.middleware.ts:12`.
- **Fazer:** redirecionar/recusar a menos que o proto seja comprovadamente `https` (default-deny), em vez de só redirecionar quando é exatamente `http`. Garantir que não quebra o dev local (a guarda já deve ser só em produção).
- **Pronto quando:** proto ausente em produção → redirect/recusa, não cleartext.
- **Validar:** teste unitário do middleware com header ausente / `http` / `https`.

---

## Fase 4 — Correção & arquitetura de API (independente)

### [ ] Step 4.1 — Timezone do cliente
- **Objetivo:** "tomorrow" deixar de assumir Europe/Lisbon para todos.
- **Ficheiros:** `backend/src/utils/dateTimeResolver.ts` e quem o chama (handlers/`dispatcher.ts`); `frontend/src/lib/api.ts` (enviar tz).
- **Fazer:** enviar a tz do browser (header, ex. `x-timezone`) e usá-la no resolver em vez da constante fixa (manter Lisbon como fallback).
- **Pronto quando:** criar "task tomorrow" numa tz ≠ Lisboa guarda o `dueAt` correto.
- **Validar:** testes do resolver + smoke manual com tz diferente.

### [ ] Step 4.2 — Título sem perda de dados
- **Objetivo:** parar de gravar o título em lowercase.
- **Ficheiros:** `backend/src/repositories/task.repository.ts` (~linha 19 e a deteção de duplicados).
- **Fazer:** guardar o título original; normalizar (lower/trim) **só** para a comparação de duplicados.
- **Pronto quando:** "Buy GROCERIES" fica gravado tal e qual; dedup continua a funcionar.
- **Validar:** `cd backend && npm test` (adicionar caso) + smoke.

### [ ] Step 4.3 — Remover `any` em erros e Prisma
- **Objetivo:** type-safety nos catch e no update de status.
- **Ficheiros:** `backend/src/repositories/task.repository.ts` (~172), handlers de delete/edit, `guards/deleteTask.guard.ts`.
- **Fazer:** `catch (error)` + `error instanceof Error ? error.message : "..."`; tipar o objeto do Prisma update; `unknown` nos type guards.
- **Pronto quando:** sem `any` nestes pontos; `tsc` e testes verdes.
- **Validar:** `cd backend && npx tsc --noEmit && npm test`

### [ ] Step 4.4 — Consolidar command-bus vs REST
- **Objetivo:** um caminho de escrita só; REST documentado como leitura.
- **Ficheiros:** `backend/src/app.ts`, `backend/src/executor/commandExecutor.ts`, `backend/src/executor/mapCoreResultToCommandResult.ts`.
- **Fazer:** documentar/garantir que os endpoints REST são só leitura (sem duplicar escritas dos handlers); remover o no-op `CommandExecutor` (ou justificar com comentário); substituir o `!` no resultado FINAL por um type guard/erro explícito.
- **Pronto quando:** sem dois caminhos de escrita; `tsc` e testes verdes.
- **Validar:** `cd backend && npx tsc --noEmit && npm test`

---

## Fase 5 — Produto / NLP (independente)

### [ ] Step 5.1 — Hora opcional na criação
- **Objetivo:** "call mom tomorrow" deve valer (hoje `time` é obrigatório).
- **Ficheiros:** `command-task-core/src/core/ambiguity/requirements.ts`; resolver/handler que assume hora.
- **Fazer:** tornar `time` opcional em `CREATE_TASK` com default sensato (ex. 09:00). Atualizar/!adicionar testes.
- **Pronto quando:** criar sem hora funciona com default; testes verdes.
- **Validar:** `cd command-task-core && npm test` + smoke.

### [ ] Step 5.2 — Validação de valores de slot no core
- **Objetivo:** rejeitar cedo valores impossíveis ("25:00", "not a date").
- **Ficheiros:** `command-task-core/src/core/slots/` + `index.ts`.
- **Fazer:** validar valores extraídos; se inválido, devolver QUESTION a pedir de novo, em vez de passar lixo ao backend. Testes.
- **Pronto quando:** input inválido gera follow-up; teste verde.
- **Validar:** `cd command-task-core && npm test`

### [ ] Step 5.3 — Matching de intent mais robusto
- **Objetivo:** "creating"/"added" passarem a casar com create/add.
- **Ficheiros:** `command-task-core/src/core/intent/detector.ts`, `intent/keywords.ts`.
- **Fazer:** stemming/lematização simples ou sinónimos para os verbos principais. Não tentar multi-idioma agora — só robustez em inglês. Testes para as variações.
- **Pronto quando:** variações comuns são detetadas; testes verdes.
- **Validar:** `cd command-task-core && npm test`

### [ ] Step 5.4 — Frontend: parsing tipado da resposta + 1º teste
- **Objetivo:** substituir os ~10 checks `in` frágeis por parsing tipado.
- **Ficheiros:** `frontend/src/hooks/useChat.ts`, tipos em `shared/`; setup de testes do frontend.
- **Fazer:** discriminated union por intent (ou Zod) na fronteira da API; escrever o 1º teste do frontend (fluxo de resposta ou auth). Depois, juntar o frontend ao `npm test` da raiz (Step 0.1).
- **Pronto quando:** sem cadeia de `in`; ≥1 teste de frontend verde; `npm test` da raiz inclui frontend.
- **Validar:** `cd frontend && npm test` && (raiz) `npm test`

---

## Fase 6 — Higiene do monorepo (qualquer altura)

### [ ] Step 6.1 — Tirar `dist/` do git
- **Ficheiros:** `shared/dist/`, `.gitignore`.
- **Fazer:** remover `shared/dist` do versionamento, adicionar a `.gitignore`, garantir que o build o regenera (`tsc -b`).
- **Pronto quando:** `dist/` deixa de aparecer no `git status` após build e o build continua a funcionar.
- **Validar:** `npm run build` && `git status`

### [ ] Step 6.2 — `index.ts` público no core + corrigir imports
- **Ficheiros:** `command-task-core/src/index.ts`, `backend/src/executor/dispatcher.ts`.
- **Fazer:** expor uma API pública limpa no core e importar por aí, em vez de chegar a `command-task-core/src/...` interno.
- **Pronto quando:** o backend não importa de caminhos internos do core; `tsc` verde.
- **Validar:** `npm run build`

### [ ] Step 6.3 — Padronizar aliases + formatação
- **Ficheiros:** `tsconfig.base.json`, `frontend/tsconfig.app.json`, imports do frontend; novo `.prettierrc` e `.editorconfig`.
- **Fazer:** usar path aliases para imports cross-package em todo o lado (frontend incluído); adicionar Prettier + EditorConfig.
- **Pronto quando:** imports cross-package consistentes; `tsc`/build verdes.
- **Validar:** `npm run build` && `npm run lint`

---

## Notas (preencher ao longo do caminho)

- **Estado do baseline (Step 0.0)** — registado 2026-05-27 (branch `development`):
  - **`npm run install:all`**: OK para root/backend/frontend. ⚠️ não instala `command-task-core` (nem `shared`/`runner`). O `node_modules` pré-existente do core estava partido (shim do jest sem bit de execução → `jest: Permission denied`); resolvido localmente com `npm ci` no `command-task-core`.
  - **`npm run build`**: ❌ FALHA (em `cd backend && tsc`):
    - TS6305 ×3 — o backend referencia `command-task-core` como projeto `composite`, mas `command-task-core/dist` não existe e não há script de build que o gere (o `npm run build` nunca o constrói). O `shared/dist` está commitado, por isso resolve; o do core não.
    - TS2366 ×1 em `src/executor/mapCoreResultToCommandResult.ts:6` (a função pode devolver `undefined`) — provavelmente cascata da resolução partida dos tipos do core.
  - **`cd command-task-core && npm test`**: ✅ VERDE — 4 suites / 55 testes (intent/detector, slots/title, slots/time, slots/date).
  - **`cd backend && npm test`**: ❌ FALHA — 2 suites / 4 testes. Duas causas:
    - `backend/dist/` obsoleto é apanhado pelo jest (mock manual duplicado no haste-map `dist/.../task.repository.js`; corre o compilado `dist/services/task.service.spec.js`).
    - O mock manual `src/repositories/__mocks__/task.repository.ts` está dessincronizado com o serviço: falta `findDueOnDate`, que o `task.service.spec.ts` chama (`repository.findDueOnDate.mockResolvedValue` → `undefined`).
  - **Frontend**: fora do *Validar* do Step 0.0; não corrido.
  - **Resumo**: core verde; build + testes do backend vermelhos. A cadeia *Validar* (`npm run build && core test && backend test`) está VERMELHA no global (pára no build).
- **Step 0.2 — ESLint** (2026-05-27): `eslint.config.mjs` criado em `backend/` e `command-task-core/` (flat config, `@typescript-eslint/recommended`, `globals.node`). Script `"lint"` adicionado nos 3 `package.json`. `npm run lint` na raiz passa a 0 erros / 1 warning (pre-existing `react-hooks/exhaustive-deps` em `useChat.ts`). Erros corrigidos/suprimidos:
  - Triviais (renomeados): catch vars `error→_error`, params `sessionId→_sessionId`, `no-case-declarations` wrapped com `{}`, `no-useless-escape` em `title.ts` corrigido, `startIntent` importação não usada removida.
  - Suprimidos com `eslint-disable-next-line` (Step 4.3 trata-os): todos os `no-explicit-any` em backend e core.
  - Frontend (pre-existente): `react-refresh/only-export-components` em `button.tsx`, `theme.tsx`, `main.tsx` — suprimidos com comentários (arquitetura a tratar noutra altura).
- **Step 0.3 — CI (GitHub Actions)** (2026-05-27): `.github/workflows/ci.yml` criado com Node LTS, passos: install:all + `npm ci` em command-task-core (para corrigir exec bits dos shims Windows no Linux), build, lint, test. YAML validado com `@action-validator/cli` (exit 0). `npm run lint` e `npm test` passam localmente. `npm run build` continua vermelho (issue pré-existente do Step 0.0, rastreado em Steps 6.1/6.2).
- Itens novos descobertos (não alargar âmbito — anotar aqui):
  - **`command-task-core/node_modules/` está commitado no git** (com shims `.cmd`/`.ps1` de Windows + CRLF) — é a causa real dos bins sem bit de execução no Linux (`jest: Permission denied`). Correr `npm ci` no core regenerou ~170 ficheiros tracked (typechange/exec-bit); **não** foram commitados nesta sessão (só o `IMPROVEMENTS_TODO.md`). Além disso o `install:all` omite `command-task-core` e `shared`. Fix próprio: tirar `node_modules` do VCS + `.gitignore` (alargar o Step 6.1) e incluir o core no `install:all` (Step 0.1).
  - `command-task-core` não tem script `build` e o `npm run build` nunca gera o seu `dist`, mas o backend referencia-o como `composite` → o build parte logo a vermelho. (Relacionado com Step 6.1/6.2.)
  - `backend/dist/` obsoleto (e `shared/dist` commitado) poluem o jest via mocks duplicados no haste-map. Considerar ignorar `dist` no jest config / tirar do VCS (Step 6.1).
  - Mock `task.repository.ts` do backend sem `findDueOnDate` → `task.service.spec.ts` vermelho. Teste partido que precede a Fase 1 (bloqueará o `npm test` da raiz do Step 0.1 até ser corrigido).
