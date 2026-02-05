import readline from "readline";

import { interpret, initialState } from "command-task-core";
import type { ConversationState } from "command-task-core";

import { Command } from "../shared/command.schema";
import { CommandResult } from "../shared/command.result";

const API_URL = "http://localhost:3000/execute";

let state: ConversationState = initialState;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Task Manager CLI");
console.log('Type commands like: "create task study english tomorrow at 10"');
console.log('Type "exit" to quit.\n');

type TaskDTO = {
  id: number;
  title: string;
  dueAt: string;
  createdAt: string;
};

type DeleteAmbiguousDTO = {
  ambiguous: true;
  candidates: TaskDTO[];
};

function prompt() {
  rl.question("> ", async (input: string) => {
    if (input.trim().toLowerCase() === "exit") {
      rl.close();
      return;
    }

    const { result, state: newState } = interpret(input, state);
    state = newState;

    if (result.type === "INFO" || result.type === "QUESTION") {
      console.log(result.message);
      return prompt();
    }

    if (result.type === "FINAL") {
      const command: Command = {
        type: "COMMAND",
        intent: result.intent,
        payload: result.payload,
      };

      await executeCommand(command);
      return prompt();
    }

    console.log("Unhandled result:", result);
    prompt();
  });
}

async function executeCommand(command: Command) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });

    const result = (await res.json()) as CommandResult<
      TaskDTO | TaskDTO[] | DeleteAmbiguousDTO
    >;

    /* ======================================================
       ✅ SUCESSO
       ====================================================== */
    if (result.status === "SUCCESS") {
      /* ======================================================
         🧠 DELETE AMBÍGUO → mostrar + guardar no Core
         ====================================================== */
      if (
        result.intent === "DELETE_TASK" &&
        typeof result.data === "object" &&
        result.data !== null &&
        "ambiguous" in result.data &&
        result.data.ambiguous === true
      ) {
        const data = result.data as DeleteAmbiguousDTO;

        console.log("Multiple tasks found:");
        data.candidates.forEach((task) => {
          console.log(
            ` #${task.id} — ${task.title} → ${new Date(
              task.dueAt,
            ).toLocaleString("pt-PT")}`,
          );
        });

        // 🔴 ESTE É O PONTO CRÍTICO
        // Guardar candidatos no estado para o Core resolver no próximo input
        state = {
          ...state,
          pendingDelete: {
            candidates: data.candidates,
          },
        };

        console.log("Choose a task by ID:");
        return;
      }

      /* ======================================================
         🧾 LISTA DE TASKS
         ====================================================== */
      if (Array.isArray(result.data)) {
        console.log("✅ Success:");
        result.data.forEach((task) => {
          console.log(
            ` Task #${task.id} — ${task.title} → ${new Date(
              task.dueAt,
            ).toLocaleString("pt-PT")}`,
          );
        });
        return;
      }

      /* ======================================================
         🆕 TASK CRIADA / DELETE CONFIRMADO / EDIT
         ====================================================== */
      console.log("✅ Success:");
      console.dir(result.data, { depth: null });
      return;
    }

    /* ======================================================
       ❌ ERRO
       ====================================================== */
    if (result.status === "ERROR") {
      console.log(result.error.code, "-", result.error.message);
    }

    if (result.status === "QUESTION") {
      console.log("QUESTION:", result.message);
    }
  } catch (err) {
    console.error("Backend unreachable:", err);
  }
}

prompt();
