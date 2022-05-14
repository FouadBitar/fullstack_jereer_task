const Pool = require('pg').Pool;
const connectionString = process.env.DATABASE_URL;
console.log(connectionString);

const pool = new Pool({ connectionString });
// const pool = new Pool();

const addUser = async (req, res) => {
  // get user from body of request
  const user = req.body.user;
  try {
    // check if username already exists
    const exists = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE username=$1 OR email=$2)',
      [user.username, user.email]
    );

    // user exists return message
    if (exists.rows[0].exists) {
      res.send({ error: 'username or email already exists' });
    }
    // create user
    else {
      await pool.query(
        'INSERT INTO users (username, email, phone_number) VALUES ($1, $2, $3)',
        [user.username, user.email, user.phoneNumber]
      );
      const newUser = await pool.query('SELECT FROM users WHERE username=$1', [
        user.username,
      ]);

      res.send({ user: newUser.rows[0] });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    let user = await pool.query('SELECT * FROM users WHERE email=$1', [
      req.body.email,
    ]);
    let posts = await pool.query('SELECT * FROM posts');

    posts = posts.rows;
    user = user.rows[0];
    res.send({ user: user, posts: posts });
  } catch (error) {
    res.send({ error: 'error occured getting the user' });
  }
};

const addPost = async (req, res) => {
  try {
    const userId = req.body.id;
    const post = req.body.post;
    await pool.query(
      "INSERT INTO posts (uid, post, date) VALUES ($1, $2, current_timestamp);",
      [userId, post]
    );
    const allPosts = await pool.query('SELECT * FROM posts');
    res.send({ posts: allPosts.rows });
  } catch (error) {
    console.log('error occured in addpost');
    console.log(error);
    res.send({ error: 'error occured in addpos' });
  }
};

const getPosts = async (req, res) => {
  console.log('now in getposts')
  try {
    const allPosts = await pool.query('SELECT * FROM posts;');
    const allUsers = await pool.query('SELECT * FROM users;');
    res.send({ posts: allPosts.rows, users: allUsers });
  } catch (error) {
    console.log('an error occured inside getposts');
    res.send().json({ error: 'error occured in addpos' });
  }
};

module.exports = {
  addUser,
  addPost,
  getPosts,
  getUser,
};
