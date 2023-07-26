var express = require('express');
var cors = require('cors');
var router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use(bodyParser.xml());

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_user',
};

// Create MySQL connection
const connection = mysql.createConnection(dbConfig);
connection.connect();

app.get('/getDataUser/:userid', (req, res) => {
  const userid = req.params.userid;

  if (userid === 'all') {
    // Fetch all users
    const query = 'SELECT * FROM tbl_user';
    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      } else {
        res.json(results);
      }
    });
  } else {
    // Fetch user by userid
    const query = 'SELECT * FROM tbl_user WHERE user_id = ?';
    connection.query(query, [userid], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: 'User not found' });
        } else {
          res.json(results[0]);
        }
      }
    });
  }
});

app.post('/setDataUser', (req, res) => {
  const userData = req.body;

  // Insert user data into the database
  const query = 'INSERT INTO tbl_user (user_id, name, username, password, status) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [userData.userid, userData.namalengkap, userData.username, userData.password, userData.status], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to insert user data' });
    } else {
      res.json({ message: 'User data inserted successfully' });
    }
  });
});

app.delete('/delDataUser/:userid', (req, res) => {
  const userid = req.params.userid;

  // Delete user data from the database
  const query = 'DELETE FROM tbl_user WHERE user_id = ?';
  connection.query(query, [userid], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete user data' });
    } else {
      res.json({ message: 'User data deleted successfully' });
    }
  });
});



app.listen(8080, () => {
  console.log('Server is running on port 8080');
});


module.exports = router;
