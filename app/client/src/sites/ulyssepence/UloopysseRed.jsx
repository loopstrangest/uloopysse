import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import './UloopysseRed.css';

// Main game scene - this is where you'll build your Pokemon-style world
class GameScene extends Phaser.Scene {
  // Grid-based movement settings (Pokemon style)
  TILE_SIZE = 16;
  MOVE_SPEED = 80; // pixels per second

  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.cursors = null;
    this.map = null;
    this.isMoving = false;
    this.moveDirection = { x: 0, y: 0 };
    this.moveTarget = null;
  }

  preload() {
    // Load your tileset image
    // Drop your tileset PNG in: public/game/tilesets/
    // this.load.image('tiles', '/game/tilesets/tileset.png');

    // Load tilemap JSON (exported from Tiled)
    // Drop your map JSON in: public/game/maps/
    // this.load.tilemapTiledJSON('map', '/game/maps/world.json');

    // Load player sprite
    // Drop your sprite PNG in: public/game/sprites/
    // this.load.spritesheet('player', '/game/sprites/player.png', {
    //   frameWidth: 16,
    //   frameHeight: 16
    // });

    // For now, we'll create placeholder graphics
    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
    // Create a simple tileset texture (grass + path)
    const tileGraphics = this.make.graphics({ x: 0, y: 0 });

    // Grass tile (0)
    tileGraphics.fillStyle(0xb4739c);
    tileGraphics.fillRect(0, 0, 16, 16);
    tileGraphics.fillStyle(0xa4537c);
    tileGraphics.fillRect(2, 2, 2, 2);
    tileGraphics.fillRect(8, 6, 2, 2);
    tileGraphics.fillRect(4, 10, 2, 2);
    tileGraphics.fillRect(12, 12, 2, 2);

    // Path tile (1)
    tileGraphics.fillStyle(0xf7754c);
    tileGraphics.fillRect(16, 0, 16, 16);
    tileGraphics.fillStyle(0xff8f8f);
    tileGraphics.fillRect(18, 3, 2, 2);
    tileGraphics.fillRect(26, 8, 2, 2);
    tileGraphics.fillRect(20, 12, 2, 2);

    // Water tile (2)
    tileGraphics.fillStyle(0x481010);
    tileGraphics.fillRect(32, 0, 16, 16);
    tileGraphics.fillStyle(0x684040);
    tileGraphics.fillRect(34, 4, 6, 2);
    tileGraphics.fillRect(38, 10, 6, 2);

    // Tree/obstacle tile (3)
    tileGraphics.fillStyle(0x481010);
    tileGraphics.fillRect(48, 0, 16, 16);
    tileGraphics.fillStyle(0x4d5a20);
    tileGraphics.fillRect(52, 2, 8, 8);
    tileGraphics.fillStyle(0x94537c);
    tileGraphics.fillRect(54, 4, 4, 4);
    tileGraphics.fillStyle(0x94537c);
    tileGraphics.fillRect(55, 10, 2, 6);

    tileGraphics.generateTexture('placeholder-tiles', 64, 16);
    tileGraphics.destroy();

    // Create player sprite
    const playerGraphics = this.make.graphics({ x: 0, y: 0 });

    // Simple character (down-facing)
    playerGraphics.fillStyle(0xff3b3b);
    playerGraphics.fillRect(4, 0, 8, 8); // head
    playerGraphics.fillStyle(0x8a4049);
    playerGraphics.fillRect(3, 8, 10, 6); // body
    playerGraphics.fillStyle(0x933333);
    playerGraphics.fillRect(4, 14, 3, 2); // left leg
    playerGraphics.fillRect(9, 14, 3, 2); // right leg

    playerGraphics.generateTexture('placeholder-player', 16, 16);
    playerGraphics.destroy();
  }

  create() {
    // Create a procedural tilemap for demo
    const mapWidth = Math.ceil(this.scale.width / this.TILE_SIZE) + 4;
    const mapHeight = Math.ceil(this.scale.height / this.TILE_SIZE) + 4;

    // Generate map data
    const mapData = [];
    for (let y = 0; y < mapHeight; y++) {
      const row = [];
      for (let x = 0; x < mapWidth; x++) {
        // Mostly grass with some paths and trees
        const rand = Math.random();
        if (rand < 0.7) {
          row.push(0); // grass
        } else if (rand < 0.85) {
          row.push(1); // path
        } else if (rand < 0.92) {
          row.push(3); // tree
        } else {
          row.push(2); // water
        }
      }
      mapData.push(row);
    }

    // Clear a spawn area
    const spawnX = Math.floor(mapWidth / 2);
    const spawnY = Math.floor(mapHeight / 2);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (mapData[spawnY + dy]) {
          mapData[spawnY + dy][spawnX + dx] = 0;
        }
      }
    }

    // Create tilemap from data
    this.map = this.make.tilemap({
      data: mapData,
      tileWidth: this.TILE_SIZE,
      tileHeight: this.TILE_SIZE
    });

    const tileset = this.map.addTilesetImage('placeholder-tiles', undefined, 16, 16, 0, 0);
    if (tileset) {
      const layer = this.map.createLayer(0, tileset, 0, 0);

      // Set collision for water and trees
      if (layer) {
        layer.setCollisionByExclusion([0, 1]);
      }
    }

    // Create player at center
    this.player = this.add.sprite(
      spawnX * this.TILE_SIZE + this.TILE_SIZE / 2,
      spawnY * this.TILE_SIZE + this.TILE_SIZE / 2,
      'placeholder-player'
    );

    // Set up camera to follow player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);

    // Set up keyboard input (don't capture keys so they still work in chat)
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      // Stop Phaser from preventing default on arrow keys and spacebar
      this.input.keyboard.removeCapture([
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
        Phaser.Input.Keyboard.KeyCodes.SPACE
      ]);
    }
  }

  update(_time, delta) {
    if (!this.player || !this.cursors) return;

    // Grid-based movement (Pokemon style)
    if (!this.isMoving) {
      if (this.cursors.left.isDown) {
        this.moveDirection = { x: -1, y: 0 };
        this.startMove();
      } else if (this.cursors.right.isDown) {
        this.moveDirection = { x: 1, y: 0 };
        this.startMove();
      } else if (this.cursors.up.isDown) {
        this.moveDirection = { x: 0, y: -1 };
        this.startMove();
      } else if (this.cursors.down.isDown) {
        this.moveDirection = { x: 0, y: 1 };
        this.startMove();
      }
    }

    // Continue movement animation
    if (this.isMoving) {
      const moveAmount = (this.MOVE_SPEED * delta) / 1000;
      this.player.x += this.moveDirection.x * moveAmount;
      this.player.y += this.moveDirection.y * moveAmount;

      // Check if we've reached the target tile
      const targetX = this.moveTarget?.x ?? this.player.x;
      const targetY = this.moveTarget?.y ?? this.player.y;

      const reachedX = this.moveDirection.x === 0 ||
        (this.moveDirection.x > 0 ? this.player.x >= targetX : this.player.x <= targetX);
      const reachedY = this.moveDirection.y === 0 ||
        (this.moveDirection.y > 0 ? this.player.y >= targetY : this.player.y <= targetY);

      if (reachedX && reachedY) {
        this.player.x = targetX;
        this.player.y = targetY;
        this.isMoving = false;
      }
    }
  }

  startMove() {
    if (!this.player) return;

    const targetX = this.player.x + this.moveDirection.x * this.TILE_SIZE;
    const targetY = this.player.y + this.moveDirection.y * this.TILE_SIZE;

    // Check for collision with tilemap
    if (this.map) {
      const tile = this.map.getTileAtWorldXY(targetX, targetY);
      if (tile && tile.index >= 2) {
        // Collision with water or trees
        return;
      }
    }

    this.moveTarget = { x: targetX, y: targetY };
    this.isMoving = true;
  }
}

function UloopysseRed() {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      pixelArt: true, // Crisp pixels for retro look
      backgroundColor: '#1a1a2e',
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      }
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="phaser-game-container" />;
}

export default UloopysseRed;
