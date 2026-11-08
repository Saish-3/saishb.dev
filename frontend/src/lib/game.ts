export const gameState = { finished: false };

export const replayBus: { fn: (() => void) | null } = { fn: null };
