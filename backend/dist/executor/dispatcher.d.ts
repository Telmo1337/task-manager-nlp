import { Command } from "../../../shared/command.schema";
import { CommandResult } from "../../../shared/command.result";
export declare function dispatchCommand(command: Command): Promise<CommandResult>;
