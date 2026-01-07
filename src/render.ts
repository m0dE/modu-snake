/**
 * Snake Game Rendering
 *
 * Factory pattern for creating the renderer function.
 * Handles main view, minimap, and stats display.
 */

import {
    Game,
    Entity,
    Simple2DRenderer,
    Transform2D,
    Sprite,
    Player,
    Camera2D,
} from 'modu-engine';

import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
} from './constants';

import { SnakeHead, DIR_SCALE } from './entities';
import { getSizeMultiplier, updateCamera } from './systems';
import type { RankEntry } from './types';

// ============================================
// Renderer Factory
// ============================================

/**
 * Creates a render function for the snake game.
 * Returns a function that can be assigned to renderer.render
 */
export function createRenderer(
    game: Game,
    renderer: Simple2DRenderer,
    getCameraEntity: () => Entity,
    canvas: HTMLCanvasElement,
    minimapCanvas: HTMLCanvasElement,
    statsLength: HTMLElement,
    statsRank: HTMLElement,
    getLocalClientIdFn: () => number | null
): () => void {
    const canvasCtx = renderer.context;
    const minimapCtx = minimapCanvas.getContext('2d')!;

    function renderWithCamera(): void {
        // Read dimensions each frame to handle resize
        const width = canvas.width;
        const height = canvas.height;

        const cameraEntity = getCameraEntity();
        const alpha = game.getRenderAlpha();
        const camera = cameraEntity.get(Camera2D);

        // Update camera to follow local player
        updateCamera(game, cameraEntity, getLocalClientIdFn);

        canvasCtx.fillStyle = '#111';
        canvasCtx.fillRect(0, 0, width, height);

        // Use camera position directly
        const camX = camera.x;
        const camY = camera.y;

        canvasCtx.save();
        canvasCtx.translate(width / 2, height / 2);
        canvasCtx.scale(camera.zoom, camera.zoom);
        canvasCtx.translate(-camX, -camY);

        // World bounds
        canvasCtx.strokeStyle = '#333';
        canvasCtx.lineWidth = 4 / camera.zoom;
        canvasCtx.strokeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Grid
        canvasCtx.strokeStyle = '#1a1a1a';
        canvasCtx.lineWidth = 1 / camera.zoom;
        const gridSize = 200;
        for (let x = 0; x <= WORLD_WIDTH; x += gridSize) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, 0);
            canvasCtx.lineTo(x, WORLD_HEIGHT);
            canvasCtx.stroke();
        }
        for (let y = 0; y <= WORLD_HEIGHT; y += gridSize) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(0, y);
            canvasCtx.lineTo(WORLD_WIDTH, y);
            canvasCtx.stroke();
        }

        // Food (render order doesn't matter for visuals)
        for (const food of game.query('food')) {
            if (food.destroyed) continue;
            food.interpolate(alpha);
            const x = food.render?.interpX ?? food.get(Transform2D).x;
            const y = food.render?.interpY ?? food.get(Transform2D).y;
            const sprite = food.get(Sprite);
            canvasCtx.fillStyle = game.getString('color', sprite.color) || '#fff';
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, sprite.radius, 0, Math.PI * 2);
            canvasCtx.fill();
        }

        // Segments
        for (const seg of game.query('snake-segment')) {
            if (seg.destroyed) continue;
            seg.interpolate(alpha);
            const x = seg.render?.interpX ?? seg.get(Transform2D).x;
            const y = seg.render?.interpY ?? seg.get(Transform2D).y;
            const sprite = seg.get(Sprite);
            canvasCtx.fillStyle = game.getString('color', sprite.color) || '#fff';
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, sprite.radius, 0, Math.PI * 2);
            canvasCtx.fill();
        }

        // Heads
        for (const head of game.query('snake-head')) {
            if (head.destroyed) continue;
            head.interpolate(alpha);
            const x = head.render?.interpX ?? head.get(Transform2D).x;
            const y = head.render?.interpY ?? head.get(Transform2D).y;
            const sprite = head.get(Sprite);
            const sh = head.get(SnakeHead);
            // getSizeMultiplier returns scaled by 100, divide for render use
            const sizeMult = getSizeMultiplier(sh.length) / 100;
            const colorStr = game.getString('color', sprite.color) || '#fff';

            // Glow when boosting
            if (sh.boosting) {
                canvasCtx.save();
                canvasCtx.shadowColor = colorStr;
                canvasCtx.shadowBlur = 30;
                canvasCtx.fillStyle = colorStr;
                canvasCtx.globalAlpha = 0.4;
                canvasCtx.beginPath();
                canvasCtx.arc(x, y, sprite.radius * 2.5, 0, Math.PI * 2);
                canvasCtx.fill();
                canvasCtx.globalAlpha = 0.6;
                canvasCtx.beginPath();
                canvasCtx.arc(x, y, sprite.radius * 1.8, 0, Math.PI * 2);
                canvasCtx.fill();
                canvasCtx.restore();
            }

            canvasCtx.fillStyle = colorStr;
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, sprite.radius, 0, Math.PI * 2);
            canvasCtx.fill();

            // Eyes (render-only, float math is fine)
            // Direction values are scaled by DIR_SCALE, so divide for actual direction
            const dirX = (sh.prevDirX + (sh.dirX - sh.prevDirX) * alpha) / DIR_SCALE;
            const dirY = (sh.prevDirY + (sh.dirY - sh.prevDirY) * alpha) / DIR_SCALE;
            const eyeOffset = 6 * sizeMult;
            const eyeRadius = 5 * sizeMult;
            const pupilRadius = 2 * sizeMult;
            const perpX = -dirY, perpY = dirX;

            for (const side of [-1, 1]) {
                const ex = x + dirX * eyeOffset + perpX * eyeOffset * side;
                const ey = y + dirY * eyeOffset + perpY * eyeOffset * side;
                canvasCtx.fillStyle = '#fff';
                canvasCtx.beginPath();
                canvasCtx.arc(ex, ey, eyeRadius, 0, Math.PI * 2);
                canvasCtx.fill();
                canvasCtx.fillStyle = '#000';
                canvasCtx.beginPath();
                canvasCtx.arc(ex + dirX * pupilRadius, ey + dirY * pupilRadius, pupilRadius, 0, Math.PI * 2);
                canvasCtx.fill();
            }
        }

        canvasCtx.restore();
        drawMinimap(camera, width, height);
        updateStats();
    }

    function updateStats(): void {
        const localId = getLocalClientIdFn();
        if (localId === null) return;

        const localHead = game.world.getEntityByClientId(localId);
        if (!localHead || localHead.destroyed) {
            statsLength.textContent = '0';
            statsRank.textContent = '- of -';
            return;
        }

        const myLength = localHead.get(SnakeHead).length;
        statsLength.textContent = String(myLength);

        const snakes: RankEntry[] = [];
        for (const head of game.query('snake-head')) {
            if (head.destroyed) continue;
            snakes.push({
                clientId: head.get(Player).clientId,
                length: head.get(SnakeHead).length
            });
        }
        snakes.sort((a, b) => b.length - a.length);

        const rank = snakes.findIndex(s => s.clientId === localId) + 1;
        statsRank.textContent = `${rank} of ${snakes.length}`;
    }

    function drawMinimap(camera: { x: number; y: number; zoom: number }, width: number, height: number): void {
        const camX = camera.x;
        const camY = camera.y;
        const mmW = minimapCanvas.width;
        const mmH = minimapCanvas.height;
        const scaleX = mmW / WORLD_WIDTH;
        const scaleY = mmH / WORLD_HEIGHT;

        minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        minimapCtx.fillRect(0, 0, mmW, mmH);

        minimapCtx.strokeStyle = '#444';
        minimapCtx.lineWidth = 1;
        minimapCtx.strokeRect(0, 0, mmW, mmH);

        minimapCtx.fillStyle = '#555';
        for (const food of game.query('food')) {
            if (food.destroyed) continue;
            const t = food.get(Transform2D);
            const mx = t.x * scaleX;
            const my = t.y * scaleY;
            minimapCtx.fillRect(mx - 1, my - 1, 2, 2);
        }

        const localId = getLocalClientIdFn();
        for (const head of game.query('snake-head')) {
            if (head.destroyed) continue;
            const t = head.get(Transform2D);
            const sprite = head.get(Sprite);
            const color = game.getString('color', sprite.color) || '#fff';
            const clientId = head.get(Player).clientId;
            const isLocal = clientId === localId;

            minimapCtx.fillStyle = color;
            const mx = t.x * scaleX;
            const my = t.y * scaleY;
            minimapCtx.beginPath();
            minimapCtx.arc(mx, my, isLocal ? 4 : 3, 0, Math.PI * 2);
            minimapCtx.fill();

            if (isLocal) {
                minimapCtx.strokeStyle = '#fff';
                minimapCtx.lineWidth = 1;
                minimapCtx.beginPath();
                minimapCtx.arc(mx, my, 6, 0, Math.PI * 2);
                minimapCtx.stroke();
            }
        }

        const viewW = (width / camera.zoom) * scaleX;
        const viewH = (height / camera.zoom) * scaleY;
        const viewX = camX * scaleX - viewW / 2;
        const viewY = camY * scaleY - viewH / 2;

        minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        minimapCtx.lineWidth = 1;
        minimapCtx.strokeRect(viewX, viewY, viewW, viewH);
    }

    return renderWithCamera;
}
