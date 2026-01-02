import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Store connected users and their rooms
const rooms = new Map();
const userRooms = new Map();

// Find or create a room for pairing
function findAvailableRoom(site) {
  // Look for a room with one user from the opposite site
  for (const [roomId, users] of rooms.entries()) {
    if (users.length === 1 && users[0].site !== site) {
      return roomId;
    }
  }
  // No available room, create a new one
  const newRoomId = `room-${Date.now()}`;
  rooms.set(newRoomId, []);
  return newRoomId;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ site }) => {
    const roomId = findAvailableRoom(site);
    const room = rooms.get(roomId);

    // Add user to room
    room.push({ id: socket.id, site });
    userRooms.set(socket.id, roomId);
    socket.join(roomId);

    console.log(`${site} user joined ${roomId}`);

    // Notify the room
    io.to(roomId).emit('user-joined', {
      site,
      usersInRoom: room.length
    });

    // If room is full, notify both users they're paired
    if (room.length === 2) {
      io.to(roomId).emit('paired', {
        message: 'You are now connected with your partner!'
      });
    }
  });

  socket.on('send-message', ({ message }) => {
    const roomId = userRooms.get(socket.id);
    if (roomId) {
      const room = rooms.get(roomId);
      const sender = room?.find(u => u.id === socket.id);
      // Send to everyone in room except sender
      socket.to(roomId).emit('receive-message', {
        message,
        from: sender?.site || 'unknown',
        timestamp: Date.now()
      });
    }
  });

  socket.on('typing', () => {
    const roomId = userRooms.get(socket.id);
    if (roomId) {
      socket.to(roomId).emit('partner-typing');
    }
  });

  socket.on('stop-typing', () => {
    const roomId = userRooms.get(socket.id);
    if (roomId) {
      socket.to(roomId).emit('partner-stopped-typing');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const roomId = userRooms.get(socket.id);
    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        // Remove user from room
        const updatedRoom = room.filter(u => u.id !== socket.id);
        if (updatedRoom.length === 0) {
          rooms.delete(roomId);
        } else {
          rooms.set(roomId, updatedRoom);
          // Notify remaining user
          io.to(roomId).emit('partner-disconnected');
        }
      }
      userRooms.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
