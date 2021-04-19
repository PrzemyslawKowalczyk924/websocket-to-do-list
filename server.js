const express = require('express');
//const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id = ' + socket.id);

  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (taskName) => {
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskName);
    console.log('User: ' + socket.id + 'just added' + 'addTask', taskName);  
  });

  socket.on('removeTask', (id) => {
    const itemToBeRemoved = tasks.find(tasks => tasks.id === socket.id);
    const taskToRemove = tasks.indexOf(itemToBeRemoved);
    if(itemToBeRemoved) {
      socket.broadcast.emit('removeTask', id);
      tasks.splice(taskToRemove, 1);
      console.log('upadateData', tasks);
    }
  });
});