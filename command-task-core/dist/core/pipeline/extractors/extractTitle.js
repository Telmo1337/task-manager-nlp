"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTitle = extractTitle;
/**
 * Extrai o título da tarefa.
 * Regra normal: depende de verbo / trigger.
 * Regra extra: título implícito quando não há intenção explícita.
 */
function extractTitle(input, ctx) {
    // 🟢 1. Se já existe título, não mexer
    if (ctx.slots.title)
        return;
    // 🟢 2. Se existe intenção explícita e não é CREATE_TASK, não mexer
    if (ctx.intent && ctx.intent !== "CREATE_TASK")
        return;
    // 🔵 3. REGRA NOVA — título implícito
    // Só se NÃO houver intenção explícita
    if (ctx.intent)
        return;
    // Precisamos de uma data (slots são arrays!)
    const date = ctx.slots.date?.[0];
    if (!date || typeof date !== "string")
        return;
    // Texto antes da data
    const dateIndex = input.indexOf(date);
    if (dateIndex <= 0)
        return;
    const beforeDate = input.slice(0, dateIndex).trim();
    // Limpar conectores óbvios no fim
    const cleaned = beforeDate.replace(/\b(at|on|for)$/i, "").trim();
    // Título demasiado curto? abortar
    if (cleaned.length < 2)
        return;
    // 🔹 Guardar como array (contrato do Core)
    ctx.slots.title = [cleaned];
}
