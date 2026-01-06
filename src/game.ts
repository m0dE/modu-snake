/**
 * Snake Game - Slither.io style multiplayer
 *
 * Main entry point that wires together all game modules.
 * Build auto-transforms: Math.sqrt() -> dSqrt(), Math.random() -> dRandom()
 */

import * as modu from 'modu-engine';

import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    FOOD_COUNT,
} from './constants';

import { defineEntities } from './entities';
import { setupCollisions, setupSystems, spawnSnake, spawnFood, killSnake } from './systems';
import { createRenderer } from './render';

// ============================================
// Game State
// ============================================

let game: modu.Game;
let renderer: modu.Simple2DRenderer;
let physics: modu.Physics2DSystem;
let input: modu.InputPlugin;
let cameraSystem: modu.CameraSystem;
let cameraEntity: modu.Entity;

let canvas: HTMLCanvasElement;
let minimapCanvas: HTMLCanvasElement;
let statsLength: HTMLElement;
let statsRank: HTMLElement;
let WIDTH: number;
let HEIGHT: number;

let mouseX: number;
let mouseY: number;
let mouseDown: boolean = false;

function getLocalClientId(): number | null {
    const clientId = game.localClientId;
    if (!clientId || typeof clientId !== 'string') return null;
    return game.internClientId(clientId);
}

// ============================================
// Input Setup
// ============================================

function setupInput(getCameraEntity: () => modu.Entity): void {
    mouseX = WIDTH / 2;
    mouseY = HEIGHT / 2;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mousedown', (e) => { if (e.button === 0) mouseDown = true; });
    canvas.addEventListener('mouseup', (e) => { if (e.button === 0) mouseDown = false; });
    canvas.addEventListener('mouseleave', () => { mouseDown = false; });

    input.action('target', {
        type: 'vector',
        bindings: [() => {
            // Convert screen to world coordinates
            const cam = getCameraEntity().get(modu.Camera2D);
            const worldX = (mouseX - WIDTH / 2) / cam.zoom + cam.x;
            const worldY = (mouseY - HEIGHT / 2) / cam.zoom + cam.y;
            return { x: worldX, y: worldY };
        }]
    });

    input.action('boost', { type: 'button', bindings: [() => mouseDown] });
}

// ============================================
// Main Entry Point
// ============================================

export function initGame(): void {
    // Get DOM elements
    canvas = document.getElementById('game') as HTMLCanvasElement;
    minimapCanvas = document.getElementById('minimap') as HTMLCanvasElement;
    statsLength = document.querySelector('#stats .length') as HTMLElement;
    statsRank = document.getElementById('rank-text') as HTMLElement;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    // Create game instance
    game = modu.createGame();
    renderer = game.addPlugin(modu.Simple2DRenderer, canvas);
    physics = game.addPlugin(modu.Physics2DSystem, { gravity: { x: 0, y: 0 } });
    input = game.addPlugin(modu.InputPlugin, canvas);
    cameraSystem = game.addPlugin(modu.CameraSystem);

    // Expose game for debugging
    (window as any).game = game;

    // Initialize game modules
    defineEntities(game);
    setupCollisions(game, physics);
    setupSystems(game);

    // Create camera entity and set it on renderer
    cameraEntity = game.spawn('camera');
    const cam = cameraEntity.get(modu.Camera2D);
    cam.x = WORLD_WIDTH / 2;
    cam.y = WORLD_HEIGHT / 2;
    renderer.camera = cameraEntity;

    // Helper to ensure camera entity exists (survives snapshot loads)
    function ensureCameraEntity(): modu.Entity {
        if (!cameraEntity || cameraEntity.destroyed || !cameraEntity.has(modu.Camera2D)) {
            cameraEntity = game.spawn('camera');
            const cam = cameraEntity.get(modu.Camera2D);
            cam.x = WORLD_WIDTH / 2;
            cam.y = WORLD_HEIGHT / 2;
            renderer.camera = cameraEntity;
        }
        return cameraEntity;
    }

    setupInput(ensureCameraEntity);

    // Set up custom renderer
    renderer.render = createRenderer(
        game,
        renderer,
        ensureCameraEntity,
        canvas,
        minimapCanvas,
        statsLength,
        statsRank,
        getLocalClientId
    );

    // Connect to server
    game.connect('snake-v34', {
        onRoomCreate() {
            for (let i = 0; i < FOOD_COUNT; i++) spawnFood(game);
        },
        onConnect(clientId: string) {
            spawnSnake(game, clientId);

            // Center camera on new local player
            if (clientId === game.localClientId) {
                const player = game.getEntityByClientId(clientId);
                if (player) {
                    const t = player.get(modu.Transform2D);
                    const cam = ensureCameraEntity().get(modu.Camera2D);
                    cam.x = t.x;
                    cam.y = t.y;
                }
            }
        },
        onDisconnect(clientId: string) {
            killSnake(game, game.internClientId(clientId));
        }
    });

    modu.enableDebugUI(game);
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
