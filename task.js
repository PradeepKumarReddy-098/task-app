async function createTask(db, title, description, status, userId, dueDate) { 
    const createdAt = new Date()
    let day = createdAt.getDate();
    let month = createdAt.getMonth() + 1;
    let year = createdAt.getFullYear();
    const created = `${year}-${month}-${day}`
    try {
      await db.run('INSERT INTO Tasks (title, description, status, user_id, created_at, due_date) VALUES (?, ?, ?, ?, ?, ?)', [title, description, status, userId, created, dueDate]);
    } catch (err) {
      throw err;
    }
  }

  async function getTasks(db, userId) {
    let query = 'SELECT * FROM Tasks where user_id= ?';
    try {
      const tasks = await db.all(query, [userId]);
      return tasks;
    } catch (err) {
      throw err;
    }
  }


  async function updateTask(db, taskId, title, description, status, dueDate,userId) {
    const updatedAt = new Date();
    let day = updatedAt.getDate();
    let month = updatedAt.getMonth() + 1;
    let year = updatedAt.getFullYear();
    month = month<10? `0${month}` : month
    day = day<10?`0${day}` : day
    const updated = `${year}-${month}-${day}`
    const checkAuthienticatedUser = await db.get(`select * from Tasks where id = ?`,[taskId])
    if (checkAuthienticatedUser.user_id !== userId){
      throw new Error("Unauthorized, You can't update this task. You can only update your own entries")
    }
    try {
      await db.run('UPDATE Tasks SET title = ?, description = ?, status = ?, due_date = ?, updated_at = ? WHERE id = ?', [title, description, status, dueDate, updated, taskId]);
    } catch (err) {
      throw err;
    }
  }

  async function deleteTask(db, taskId,userId) {
    const checkAuthienticatedUser = await db.get(`select * from Tasks where id = ?`,[taskId])
    if (checkAuthienticatedUser.user_id !== userId){
      throw new Error("Unauthorized, You can't delete this task. You can only delete your own entries")
    }
    try {
      await db.run('DELETE FROM Tasks WHERE id = ?', [taskId]);
    } catch (err) {
      throw err;
    }
  }

  async function tasksById(db, userId, taskId) {
    const checkAuthenticatedUser = await db.get(`select * from Tasks where id = ?`, [taskId]);
    if (checkAuthenticatedUser.user_id != userId) {
      throw new Error("Unauthorized, You can't access this task. You can only access your own entries");
    }
    if (!checkAuthenticatedUser) {
      throw new Error("Task not found");
    }
    let query = `SELECT * FROM Tasks where id= ?`;
    console.log(query)
    try {
      const tasks = await db.get(query, [taskId]);
      return tasks;
    } catch (err) {
      throw err;
    }
  }

module.exports = {createTask,getTasks,updateTask,deleteTask,tasksById}
