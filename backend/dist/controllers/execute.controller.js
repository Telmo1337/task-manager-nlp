"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommandController = executeCommandController;
const commandExecutor_1 = require("../executor/commandExecutor");
const executor = new commandExecutor_1.CommandExecutor();
async function executeCommandController(req, res) {
    const command = req.body;
    if (!command || command.type !== "COMMAND") {
        return res.status(400).json({
            status: "ERROR",
            error: {
                code: "INVALID_COMMAND",
                message: "Invalid command format"
            }
        });
    }
    const result = await executor.execute(command);
    return res.json(result);
}
