import { CoreResult } from "command-task-core/src/core/types";
import { CommandResult } from "../../../shared/command.result";

export function mapCoreResultToCommandResult(
  result: CoreResult
): CommandResult | null {
  switch (result.type) {
    case "QUESTION":
      return {
        status: "QUESTION",
        message: result.message,
      };

    case "INFO":
      return {
        status: "SUCCESS",
        intent: "LIST_TASKS", // dummy / neutro
        data: { message: result.message },
      };

    case "FINAL":
      return null; // ⬅️ FINAL NÃO É resposta HTTP
  }
}
