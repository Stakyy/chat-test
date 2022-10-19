const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');

const PORT = process.env.PORT || 8080;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

const rooms = new Map();

app.use(cors({ origin: ['http://localhost:3001'] }));
app.use(express.json());

// app.use('/api', userRouter);
// app.use('/api', postRouter);
app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  res.send();
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).emit('ROOM:SET_USERS', users);
    console.log('user connected', socket.id);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
    const message = { userName, text };
    rooms.get(roomId).get('messages').push(message);
    socket.to(roomId).emit('ROOM:NEW_MESSAGE', message);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).emit('ROOM:SET_USERS', users);
        console.log('user disconnected', socket.id);
      }
    });
  });
});

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log(`server on port ${PORT}`);
});
