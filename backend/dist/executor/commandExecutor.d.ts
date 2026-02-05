import { Command } from "../../../shared/command.schema";
import { CommandResult } from "../../../shared/command.result";
export declare class CommandExecutor {
    execute(command: Command): Promise<CommandResult>;
}
