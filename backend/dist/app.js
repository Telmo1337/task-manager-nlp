"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const execute_controller_1 = require("./controllers/execute.controller");
dotenv_1.default.config();
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    }));
    app.use(express_1.default.json());
    app.post("/execute", execute_controller_1.executeCommandController);
    return app;
}
