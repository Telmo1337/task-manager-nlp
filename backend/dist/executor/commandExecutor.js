"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandExecutor = void 0;
const dispatcher_1 = require("./dispatcher");
class CommandExecutor {
    async execute(command) {
        return (0, dispatcher_1.dispatchCommand)(command);
    }
}
exports.CommandExecutor = CommandExecutor;
