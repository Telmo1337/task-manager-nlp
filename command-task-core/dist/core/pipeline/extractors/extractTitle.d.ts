import { PipelineContext } from "../types";
/**
 * Extrai o título da tarefa.
 * Regra normal: depende de verbo / trigger.
 * Regra extra: título implícito quando não há intenção explícita.
 */
export declare function extractTitle(input: string, ctx: PipelineContext): void;
