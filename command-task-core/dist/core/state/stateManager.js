"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetState = resetState;
exports.startIntent = startIntent;
exports.awaitSlot = awaitSlot;
exports.fillSlot = fillSlot;
/* ======================================================
   RESET TOTAL DO ESTADO
   ====================================================== */
function resetState() {
    return {
        slots: {}
    };
}
/* ======================================================
   INICIAR UMA INTENÇÃO
   ====================================================== */
function startIntent(intent) {
    return {
        activeIntent: intent,
        slots: {}
    };
}
/* ======================================================
   MARCAR QUE ESTAMOS À ESPERA DE UM SLOT
   ====================================================== */
function awaitSlot(state, slot) {
    return {
        ...state,
        awaitingSlot: slot
    };
}
/* ======================================================
   PREENCHER SLOT E LIMPAR awaitingSlot
   ====================================================== */
function fillSlot(state, slot, value) {
    return {
        ...state,
        awaitingSlot: undefined, // ✅ nunca null
        slots: {
            ...state.slots,
            [slot]: [value]
        }
    };
}
