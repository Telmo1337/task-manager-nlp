import { Command } from "../../../shared/command.schema";
import { CommandResult } from "../../../shared/command.result";
import { dispatchCommand } from "./dispatcher";

export class CommandExecutor {
  async execute(command: Command, sessionId?: string): Promise<CommandResult> {
    return dispatchCommand(command, sessionId);
  }
}
