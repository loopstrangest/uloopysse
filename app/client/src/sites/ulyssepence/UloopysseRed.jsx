import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import './UloopysseRed.css';

class BinarySplitPartitioning {
  static createRoomReverseTree(width, height, iterations) {
    const w = width
    const h = height
    const ratio = w / (w + h)

    const tree = {
      bl: [0, 0],
      tr: [w, h],
      parent: null,
    }

    let leaves = [tree]
    for (let i = 0; i < iterations; i++) {
      let newLeaves = []
      for (let leaf of leaves) {
        // Vertical line
        const dividerRandom = 0.48 + 0.04 * Math.random()
        if (Math.random() < ratio) {
          const divider = leaf.bl[0] + Math.floor((leaf.tr[0] - leaf.bl[0]) * dividerRandom)
          newLeaves.push(
            {
              bl: leaf.bl,
              tr: [divider, leaf.tr[1]],
              parent: leaf,
            },
            {
              bl: [divider, leaf.bl[1]],
              tr: leaf.tr,
              parent: leaf,
            }
          )

        // Horizontal Line
        } else {
          const divider = leaf.bl[1] + Math.floor((leaf.tr[1] - leaf.bl[1]) * dividerRandom)
          newLeaves.push(
            {
              bl: leaf.bl,
              tr: [leaf.tr[0], divider],
              parent: leaf,
            },
            {
              bl: [leaf.bl[0], divider],
              tr: leaf.tr,
              parent: leaf,
            }
          )
        }
      }

      leaves = newLeaves
    }

    const removals = leaves.length / 2
    for (let i = 0; i < removals; i++) {
      const tempIdx = Math.floor(leaves.length * Math.random())
      const temp = leaves[0]
      leaves[0] = leaves[tempIdx]
      leaves[tempIdx] = temp
      leaves.shift() 
    }

    return leaves
  }
}

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
    // Load tileset image
    this.load.image('tiles', '/game/tilesets/tileset.png');

    // Load tilemap JSON (exported from Tiled)
    // Drop your map JSON in: public/game/maps/
    // this.load.tilemapTiledJSON('map', '/game/maps/world.json');

    // Load player sprite
    // Drop your sprite PNG in: public/game/sprites/
    // this.load.spritesheet('player', '/game/sprites/player.png', {
    //   frameWidth: 16,
    //   frameHeight: 16
    // });

    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
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
    const mapWidth = Math.ceil(this.game.config.width);
    const mapHeight = Math.ceil(this.game.config.height);

    const mapData = [];
    for (let y = 0; y < mapHeight; y++) {
      const row = [];
      for (let x = 0; x < mapWidth; x++) {
        row.push(5)
      }
      mapData.push(row);
    }

    const carveRoom = (bl, tr, padding) => {
      for (let row = bl[1] + padding; row < tr[1] - padding; row++) {
        for (let col = bl[0] + padding; col < tr[0] - padding; col++) {
          mapData[row][col] = 0
        }
      }
    }

    const carveHallway = (room1, room2) => {
      const center1 = [
        Math.floor((room1.bl[0] + room1.tr[0]) / 2),
        Math.floor((room1.bl[1] + room1.tr[1]) / 2)
      ]
      const center2 = [
        Math.floor((room2.bl[0] + room2.tr[0]) / 2),
        Math.floor((room2.bl[1] + room2.tr[1]) / 2)
      ]

      const [startX, endX] = center1[0] < center2[0]
        ? [center1[0], center2[0]]
        : [center2[0], center1[0]]
      for (let col = startX; col <= endX; col++) {
        if (mapData[center1[1]]) mapData[center1[1]][col] = 0
      }

      const [startY, endY] = center1[1] < center2[1]
        ? [center1[1], center2[1]]
        : [center2[1], center1[1]]
      for (let row = startY; row <= endY; row++) {
        if (mapData[row]) mapData[row][center2[0]] = 0
      }
    }

    const bspIterations = 4
    const padding = 1
    let parents = BinarySplitPartitioning.createRoomReverseTree(mapWidth, mapHeight, bspIterations)
    for (let i = 0; i < bspIterations; i++) {
      let newParents = []
      for (let j = 0; j < parents.length; j += 2) {
        const left = parents[j]
        const right = parents[j + 1]

        if (i == 0) {
          carveRoom(left.bl, left.tr, padding)
          carveRoom(right.bl, right.tr, padding)
        }

        carveHallway(left, right)
        newParents.push(left.parent)
      }

      parents = newParents
      if (parents.length == 1) {
        break
      }
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

    const tileset = this.map.addTilesetImage('tiles', undefined, 16, 16, 0, 0);
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
      width: 40,
      height: 40,
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
