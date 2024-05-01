const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const path = require('path');
const user = require('./user')
const task=require('./task');
const app = express();

app.use(express.json());

const dbPath = path.join(__dirname,"./Tasks.db");
let db = null;

const initiatingServerAndDatabase = async() => {
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        });
        app.listen(3001,()=>console.log(`app is running at localhost:3001`))
    }catch(e){
        console.log({message:e});
    }
}

initiatingServerAndDatabase();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized user' });
  }
  const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'PRIVATE_KEY');
    req.userId = decoded.userId;
    //console.log(req.userId)
    next();
}

app.post('/users/register', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password){
        return res.status(400).send("Please provide all necessary details to register")
    }
    try {
      const result = await user.register(db, username, password);
      res.send({ message: result.message });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });

  app.post('/users/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
        return res.status(400).send("Please provide all necessary details to login")
    }
    try {
      const loggedUser = await user.login(db, username, password);
      const token = jwt.sign({ userId: loggedUser.id }, 'PRIVATE_KEY');
      res.send({ jwt_token:token });
    } catch (err) {
      res.status(401).send({ message: err.message });
    }
  });

  app.post('/tasks', verifyJWT, async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    const userId = req.userId
    if (!title || !description || !status) {
      return res.status(400).send("Please provide all necessary task details");
    }
    if (status!="Todo" && status!="Inprogress" && status!="Completed"){
      return res.status(400).send("Status value should be Todo, Inprogress, Completed")
    }
    try {
      await task.createTask(db, title, description, status, userId, dueDate);
      res.status(401).send({ message: 'Task created successfully' });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });

  app.get('/tasks', verifyJWT, async (req, res) => {
    const userId = req.userId;
    try {
      const tasks = await task.getTasks(db, userId);
      res.send(tasks);
    } catch (err) {
      res.status(500).send({ message: 'Error retrieving tasks' });
    }
  });

  app.get('/tasks/:taskId', verifyJWT, async (req, res) => {
    const userId = req.userId;
    const taskId = req.params.taskId;
    try{
      const tasks = await task.tasksById(db, userId, taskId);
      res.send(tasks);
    }catch(err){
      res.status(400).send({ message: err.message });
    }
  });

  app.put('/tasks/:taskId', verifyJWT, async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.userId
    const { title,description, status, dueDate } = req.body;
    if (!title || !description || !status || !dueDate){
      return res.status(400).send("please provide the values for title, description, status, dueDate to update the task")
    }
    try {
      await task.updateTask(db, taskId, title, description, status, dueDate,userId);
      res.send({ message: 'Task updated successfully' });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });

  app.delete('/tasks/:taskId', verifyJWT, async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.userId;
    try {
      await task.deleteTask(db, taskId,userId);
      res.send({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });
