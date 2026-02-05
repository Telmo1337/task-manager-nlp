import { Request, Response } from "express";
import { CommandExecutor } from "../executor/commandExecutor";
import { validateCommand } from "../validators/command.validator";
import { randomUUID } from "crypto";

const executor = new CommandExecutor();

export async function executeCommandController(req: Request, res: Response) {
  // Validate command with Zod
  const validation = validateCommand(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      status: "ERROR",
      error: {
        code: "INVALID_COMMAND",
        message: validation.error.issues[0]?.message || "Invalid command format"
      }
    });
  }

  const command = validation.data;

  // Get or create session ID from header
  let sessionId = req.headers["x-session-id"] as string;
  if (!sessionId) {
    sessionId = randomUUID();
  }

  try {
    const result = await executor.execute(command, sessionId);

    // Return session ID in response header for client to reuse
    res.setHeader("x-session-id", sessionId);
    return res.json(result);
  } catch (error) {
    console.error("Command execution error:", error);
    
    const message = error instanceof Error ? error.message : "Unknown error";
    
    // Return friendly error for invalid dates
    if (message.startsWith("Invalid date:")) {
      return res.json({
        status: "ERROR",
        error: {
          code: "INVALID_DATE",
          message: message
        }
      });
    }
    
    return res.status(500).json({
      status: "ERROR",
      error: {
        code: "EXECUTION_ERROR",
        message: message
      }
    });
  }
}
