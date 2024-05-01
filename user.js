const bcrypt = require('bcrypt');

async function register(db, username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const selectQuery = `select * from Users where username = ?`
        const usernameExit = await db.get(selectQuery,[username]);
        if (usernameExit){
            return {status:400,
                message:'Username already exits please try another name'
            }
        }
        await db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        return {
            status:200,
            message:'User created successfully'
        }
    } catch (err) {
        return { status: 400, message: 'Error creating user' }
    }
  }

  async function login(db, username, password) {
    try {
      const user = await db.get('SELECT * FROM Users WHERE username = ?', [username]);
      if (!user) {
        throw new Error('Invalid username or password');
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid password');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  module.exports = {register,login};