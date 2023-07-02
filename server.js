/* The code above imports the necessary dependencies and sets up an
 Express application with JSON parsing and CORS middleware. */
// Importing required modules
const express = require('express');// Express framework for building web applications
const mysql = require('mysql2');// MySQL database driver
const cors = require('cors');// Cross-Origin Resource Sharing middleware

// Creating an instance of Express
const app = express();
app.use(express.json()) // Middleware to parse JSON data
app.use(cors()); // Middleware for enabling Cross-Origin Resource Sharing

/* This section establishes a connection to the MySQL database
 using the provided credentials. */
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Neraph1902',
  database: 'db_project6'
});

/*This code connects to the database and logs a success message if the 
connection is successful. Otherwise, it logs an error message. */
con.connect((err) => {
  if (err) {
    console.error('Error in connection to data base', err);
    return;
  }
  console.log('Connected to the data base');
});


//////// GET WITH ID//////
//This code defines a route handler for a GET request with a parameter id for fetching a specific user.
// This route handles a GET request for a specific user
app.get('/users/:id', (req, res) => {
   // Handle GET request for a specific user
  let userId = req.params.id;  // Extract the user ID from the request parameters
  userId = userId.substring(1); // Remove the leading slash from the ID
  //console.log(userId);

  // Create an SQL query with a prepared parameter
  const query = 'SELECT * FROM users WHERE id = ?';

  // Execute the SQL query with the parameter
  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }

    // Check if the user exists
    if (results.length === 0) {
      return res.send({ error: 'user not found' });  // Return an error response if the user is not found
    }

    // If the query executed successfully without any errors
    // Send the response with the details of the user
    const user = results[0]; 
    res.send(user); // Send the new user as a response
  });
});

// GET for post 
//url example: http://localhost:3000/posts/:1
//This code defines a route handler for a GET request with a parameter userId for fetching posts related to a specific user.
app.get('/posts/:userId', (req, res) => {
  // Handle GET request for posts of a specific user
  let userId = req.params.userId; // Extract the userId from the request parameters
  userId = userId.substring(1); // Remove the leading '/' character from the userId
  //console.log(userId);

  // Create an SQL query with a prepared parameter
  const query = 'SELECT * FROM posts WHERE userId = ? ORDER BY id ASC;';

  
  // Execute the SQL query with the parameter
  con.query(query, [userId], (err, results) => {
    if (err) {
      //If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }

    // Check if any posts were found for the given userId
    if (results.length === 0) {
       // If no posts were found, send a response with an error message
      return res.send({ error: 'posts not found' });
    }

    // If posts were found, send a response with the retrieved posts
    const posts = results;
    res.send(posts); // Send the new posts as a response
  });
});


//This code defines a route handler for a GET request with a parameter postId for fetching comments related to a specific post.
app.get('/comments/:postId', (req, res) => {
  //Handle GET request for comments of a specific post
  let postId = req.params.postId;   // Extract the postId from the request parameters
  postId = postId.substring(1); // Remove the leading '/' character from the postId
  //console.log(userId);


  // Define the SQL query to retrieve comments of a specific post
  const query = 'SELECT * FROM comments WHERE postId = ?';

  // Execute the SQL query with the postId as a parameter
  con.query(query, [postId], (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }


    // Check if any posts were found for the given userId
    if (results.length === 0) {
      // If no posts were found, send a response with an error message
      return res.send({ error: 'comments not found' });
    }

    // Send the response with the retrieved posts
    const comments = results;
    res.send(comments); // Send the new comment as a response
  });
});


//This code defines a route handler for a GET request with a parameter userId for fetching todos related to a specific user.
app.get('/todos/:userId', (req, res) => {
  // Handle GET request for todos of a specific user
  let userId = req.params.userId; // Extract the userId from the request parameters
  userId = userId.substring(1); // Remove the leading '/' character from the userId
  //console.log(userId);

  // Define the SQL query to retrieve todos of a specific user
  const query = 'SELECT * FROM todos WHERE userId = ?';

  // Execute the SQL query with the userId as a parameter
  con.query(query, [userId], (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }

    // Check if any todos were found for the given userId
    if (results.length === 0) {
        // If no todos were found, send a response with an error message
      return res.send({ error: 'todos not found' });
    }

    // If todos were found, send a response with the retrieved todos
    const todos = results;
    res.send(todos);
  });
});


//This code defines a route handler for a GET request for user login, where the username and password are provided as query parameters.
// for login step
// url to send example: http://localhost:3000/users?username="Bret"&password="y1W2RM8j"s
app.get('/users', (req, res) => {
  // Handle GET request for user login

  // Extract the username and password from the request query parameters
  let username = req.query.username; 
  let password = req.query.password;

  // Construct the SQL query to retrieve user details based on the provided username and password
  const query = `SELECT * FROM users WHERE( id IN (SELECT users.id FROM users INNER JOIN users_passwords ON users.id=users_passwords.userId
    WHERE users.username='${username}' AND users_passwords.password='${password}'))`;

  // Execute the SQL query
  con.query(query, (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }

   // Check if any user was found for the provided username and password
    if (results.length === 0) {
       // If no user was found, send a response with an error message
      return res.send({ error: 'user not found' });
    }
    // If a user was found, send a response with the retrieved user details
    const user = results;
    res.send(user);
  });
});


//This code defines a route handler for a GET request with a parameter userId for fetching albums related to a specific user.
// get albums according to userId
app.get('/albums/:userId', (req, res) => {
  //Handle GET request for albums of a specific user
  let userId = req.params.userId; // Extract the userId from the request parameters
  userId = userId.substring(1); // Remove the leading '/' character from the userId

  // Define the SQL query to retrieve albums of a specific user
  const query = 'SELECT * FROM albums WHERE userId = ?';

  // Execute the SQL query with the userId as a parameter
  con.query(query, [userId], (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving albums details.' });
    }

    // Check if any albums were found for the given userId
    if (results.length === 0) {
        // If no albums were found, send a response with an error message
      return res.send({ error: 'albums not found' });
    }

    // send response
    // If albums were found, send a response with the retrieved albums
    const albums = results;
    res.send(albums);
  });
});


//This code defines a route handler for a GET request with a parameter albumId for fetching photos related to a specific album.
// get photos according to albumId
app.get('/photos/:albumId', (req, res) => {
  // Handle GET request for photos of a specific album
  let albumId = req.params.albumId; // Extract the albumId from the request parameters
  albumId = albumId.substring(1); // Remove the leading '/' character from the albumId

  // Define the SQL query to retrieve photos of a specific album
  const query = 'SELECT * FROM photos WHERE albumId = ?';

  // Execute the SQL query with the albumId as a parameter
  con.query(query, [albumId], (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving photos details.' });
    }
   
    // Check if any photos were found for the given albumId
    if (results.length === 0) {
      // If no photos were found, send a response with an error message
      return res.send({ error: 'photos not found' });
    }

    // If photos were found, send a response with the retrieved photos
    const photos = results;
    res.send(photos);
  });
});


//This code defines a route handler for a GET request with a parameter userId for fetching user passwords.
app.get('/users_passwords/:userId', (req, res) => {
  // Handle GET request for user passwords

  // Define the SQL query to retrieve user passwords for a specific userId
  const query = 'SELECT * FROM users_passwords WHERE userId = ?';

  // Execute the SQL query
  con.query(query, (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }

    // Check if any results were returned by the query
    if (results.length === 0) {
        // If no results were found, send a response with an error message
      return res.send({ error: 'user id and password not found' });
    }

    // If results were found, send a response with the retrieved user passwords
    const user_and_password = results;
    res.send(user_and_password);
  });
});


//// GET WITHOUT PARAMETER////

// return all users

// app.get('/users', (req, res) => {

//   // Create SQL request
//   const query = 'SELECT * FROM users';

//   //Execute SQL query 
//   con.query(query, (err, results) => {
//     if (err) {
//       console.error('Error in request execution', err);
//       res.status(500);
//       return res.send({ error: 'An error occurred while retrieving user details.' });
//     }

//     // Vérification if user exists
//     if (results.length === 0) {
//       return res.send({ error: 'users not found' });
//     }

//     //Send response
//     const users = results;
//    // res.status(200);
//     res.send(users);
//   });
// });

//This code defines a route handler for a GET request to '/posts' endpoint.
app.get('/posts', (req, res) => {

  // Define the SQL query to retrieve all posts
  const query = 'SELECT * FROM posts';

  // Execute SLQ query
  con.query(query, (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }

    // Check if any posts were found
    if (results.length === 0) {
      // If no posts were found, send a response with an error message
      return res.send({ error: 'posts not found' });
    }

    // Send response
    // If posts were found, send a response with the retrieved posts
    const posts = results;
    res.send(posts);
  });
});


// This code defines a route handler for a GET request to '/comments' endpoint.
app.get('/comments', (req, res) => {

  // Create an SQL query to retrieve all comments from the database
  const query = 'SELECT * FROM comments';

  // Execute SQL request 
  con.query(query, (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }

    // Check if any comments were found
    if (results.length === 0) {
      // If no comments were found, send a response with an error message
      return res.send({ error: 'comments not found' });
    }

    // Send response
    // If comments were found, send a response with the retrieved comments
    const comments = results;
    res.send(comments);
  });
});


// This code defines a route handler for a GET request to '/users_passwords' endpoint.
app.get('/users_passwords', (req, res) => {

  // Define the SQL query to retrieve all data from the 'users_passwords' table
  const query = 'SELECT * FROM users_passwords ';

  // Execute SQL request
  con.query(query, (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }

    // Check if any results were found
    if (results.length === 0) {
      // If no results were found, send a response with an error message
      return res.send({ error: 'user id and password not found' });
    }

    // Send response
    // If results were found, send a response with the retrieved data (user_id and password)
    const user_and_password = results;
    res.send(user_and_password);
  });
});


//// GET TODOS
//This code defines a route handler for a GET request for todos, where the completed field is used as a query parameter to filter the results.
// get todos according to completed field
//url example: http://localhost:3000/todos?completed=true
app.get('/todos', (req, res) => {
  // Handle GET request for todos based on completed field

  let completed = req.query.completed; // Extract the value of the 'completed' query parameter from the request

  // Define the SQL query to retrieve todos based on the 'completed' field
  const query = `SELECT * FROM todos WHERE completed=${completed}`;

  // Execute the SQL query
  con.query(query,  (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving todos details.' });
    }

    // Check if any todos were found for the given 'completed' value
    if (results.length === 0) {
      // If no todos were found, send a response with an error message
      return res.send({ error: 'todos not found' });
    }

    // If todos were found, send a response with the retrieved todos
    const todos = results;
    res.send(todos);
  });
});



///// POST/////

/// POST a new todos
//This code defines a route handler for a POST request
app.post('/todos', (req, res) => {
 // Handle POST request for creating a new todo

  const newTodo = req.body; // Extract the newTodo object from the request body
  
  // Define the SQL query to insert the new todo into the 'todos' table
  const query = 'INSERT INTO todos SET ?';

  // Execute the SQL query with the newTodo object as a parameter
  con.query(query, [newTodo], (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500);  // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }
    // If the query execution is successful, send a response with a status code of 200 and the newTodo object
     res.status(200); // Set the response status to 200 (OK)
     res.send(newTodo);
  });
});

// POST a new post
// url example: http://localhost:3000/posts
app.post('/posts', (req, res) => {

  const newPost = req.body;// Extract the newTodo object from the request body
  
  // Define the SQL query to insert the new todo into the 'todos' table
  const query = 'INSERT INTO posts SET ?';

  // Execute the SQL query with the newPost object as a parameter
  con.query(query, [newPost], (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred adding new post' });
    }
    // If the post is successfully added to the database, send a response with status 200 and the newPost object
     res.status(200); // Set the response status to 200 (OK)
     res.send(newPost);
  });
});

//POST a new comment
// url example: http://localhost:3000/comments
// This route handles a POST request to '/comments'
app.post('/comments', (req, res) => {
 //Retrieve the new comment data from the request body
  const newComment = req.body;
  
  // Define the SQL query to insert the new comment into the 'comments' table
  const query = 'INSERT INTO comments SET ?';

  // Execute the SQL query using the connection 'con'
  con.query(query, [newComment], (err, results) => {
    // Check for errors during the query execution
    if (err) {
      // Log the error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      // Send an error response indicating that an error occurred while adding the new comment
      return res.send({ error: 'An error occurred adding new comment' });
    }

    //If the query executed successfully without any errors
     res.status(200); //Set the response status to 200 (OK)
     res.send(newComment);  // Send the new comment as a response
  });
});

// POST a new user 
// url example: http://localhost:3000/users
// object example:
// {
//   "name": "David",
//   "username": "david.Israel",
//   "email": "david@jisrael.ca",
//   "street": "Adanei Paz",
//   "suite": "Suite 486",
//   "city": "New York",
//   "phone": "0567891425",
//   "website": "david.net"
// }

// This code defines a route handler for a POST request to '/users' endpoint.
// It expects the request body to contain data for creating a new user.
app.post('/users', (req, res) => {

  const newUser = req.body; // Extract the new user data from the request body
  
  // Define the SQL query to insert the new user into the 'users' table
  const query = 'INSERT INTO users SET ?';

  const username=newUser.username; // Extract the username from the new user data

  // Define the SQL query to retrieve the newly added user
  const query1 = 'SELECT * FROM users WHERE username = ?';

  // Execute the first query to insert the new user into the database
  con.query(query, [newUser], (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred adding new user' });
    }

    // Execute the second query to retrieve the newly added user from the database
    con.query(query1, username, (err, results1) => {
      if (err) {
            // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', err);
        res.status(500); // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'An error occurred getting user' });
      }

      const user=results1;
      res.status(200); //Set the response status to 200 (OK)
      res.send(user);});  // Retrieve the user details from the query results
  });
});

// This code defines a route handler for a POST request to '/users_passwords' endpoint.
app.post('/users_passwords', (req, res) => {

  const new_user_pass=req.body; // Extract the data from the request body

  // Define the SQL query to insert the new user password into the 
  const query = 'INSERT INTO users_passwords SET ?';

  // Execute the SQL query with the new user password as a parameter
  con.query(query, [new_user_pass], (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while retrieving user details.' });
    }
 
    // If the query is successful, send a response with the new user password data
     res.status(200); //Set the response status to 200 (OK)
     res.send(new_user_pass);
  });
});


///// PUT /////

//PUT for todos for completed 
// url example: http://localhost:3000/todos/completed?id=1&completed=true
// This code defines a route handler for a PUT request to '/todos/completed' endpoint.
// The request expects two query parameters: 'id' and 'completed'
app.put('/todos/completed', (req, res) => {

  // Extract the values of 'id' and 'completed' query parameters from the request
  const todoId = req.query.id; 
  const todoPut = req.query.completed ; 

  // Log the values of 'id' and 'completed' for debugging purposes
  console.log(todoId);
  console.log(todoPut);

 // Define the SQL query to update the 'completed' field of a todo with a specific 'id'
  const query = `UPDATE todos SET completed =${todoPut} WHERE id = ?`;

  // Execute the SQL query with the 'id' as a parameter
  con.query(query, todoId, (error, results) => {
    if (error) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', error);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while updating the completed field.' });
    }

    // Check if any rows were affected by the update operation
    if (results.affectedRows === 0) {
        // If no rows were affected, send a response with an error message
      return res.send({ error: 'todo not found' });
    }

   // If the update was successful, send a response with the value of 'completed' parameter
    res.status(200); //Set the response status to 200 (OK)
    res.send(todoPut); 
  });
});

// PUT for title
// example of url : http://localhost:3000/todos/title?id=1&title=saluuut
// This code defines a route handler for a PUT request to '/todos/title' endpoint.
// The handler is responsible for updating the title of a todo item.
app.put('/todos/title', (req, res) => {

  // Extract the todoId and todoPutTitle from the request query parameters
  const todoId = req.query.id; 
  const todoPutTitle = req.query.title ; 

  // Log the todoId and todoPutTitle to the console for debugging purposes
  console.log(todoId);
  console.log(todoPutTitle);

 // Define the SQL query to update the title of the todo item with the given todoId
  const query = `UPDATE todos SET title='${todoPutTitle}' WHERE id = ?`;

  // Execute the SQL query with the todoId as a parameter
  con.query(query, todoId, (error, results) => {
    if (error) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', error);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred while updating the title field.' });
    }

    // Check if the update query affected any rows in the database
    if (results.affectedRows === 0) {
      // If no rows were affected, send a response with an error message
      return res.send({ error: 'todo not found' });
    }

    // If the update was successful, send a response with the updated title
    res.status(200); //Set the response status to 200 (OK)
    res.send(todoPutTitle); 
  });
});



//PUT a post according to the id

// This code defines a route handler for a PUT request to '/posts/:id' endpoint.
// The ':id' in the route path represents a parameter that can be accessed through the 'req.params' object.
app.put('/posts/:id', (req, res) => {

  const newPost = req.body;  // Retrieve the new post data from the request body
  let postId = req.params.id; // Extract the postId from the request parameters
  postId = postId.substring(1); // Remove the leading '/' character from the postId

  // Define the SQL query to update the title of the post with the given id
  const query= `UPDATE posts SET title='${newPost.title}' WHERE id=?`;
  // Define the SQL query to update the body of the post with the given id
  const query1 = `UPDATE posts SET body='${newPost.body}' WHERE id=?`;

  // Execute the first SQL query to update the title of the post
  con.query(query, postId, (err, results) => {
    if (err) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', err);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error occurred updating posts title ' });
    }
    // Execute the second SQL query to update the body of the post
    con.query(query1, postId, (err, results1) => {
      if (err) {
          // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', err);
        res.status(500); // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'An error occurred updating posts titler' });
      }
      
      // If both queries are successful, send a response with the updated postId
      res.status(200); //Set the response status to 200 (OK)
      res.send(postId);});
  });
});

//PUT a comment according to the id
// url example: http://localhost:3000/comments?id=1&body=body example

// app.put('/comments', (req, res) => {
//   const commentId = req.query.id; 
//   const commentPutBody = req.query.body ; 
//   // console.log(postId);
//   // console.log(postPutBody);

 
//   const query = `UPDATE comments SET body='${commentPutBody}' WHERE id = ?`;
 
//   con.query(query, commentId, (error, results) => {
//     if (error) {
//       console.error('Error in request execution', error);
//       res.status(500);
//       return res.send({ error: 'An error in changing comment.' });
//     }

//     if (results.affectedRows === 0) {
//       //res.status(404);
//       return res.send({ error: 'comment not found' });
//     }

    
//     res.status(200);
//     res.send(commentPutBody);  
//   });
// });


// This code defines a route handler for a PUT request to '/comments/:id' endpoint.
// The ':id' in the route path represents a parameter that can be accessed through the 'req.params' object.
app.put('/comments/:id', (req, res) => {

  let commentId = req.params.id; // Extract the commentId from the request parameters
  commentId = commentId.substring(1); // Remove the leading '/' character from the commentId
  const newComment = req.body; // Extract the new comment data from the request body

  // Define SQL queries to update the comment's name, email, and body based on the commentId
  const query = `UPDATE comments SET name='${newComment.name}' WHERE id = ?`;
  const query1 = `UPDATE comments SET email='${newComment.email}' WHERE id = ?`;
  const query2 = `UPDATE comments SET body='${newComment.body}' WHERE id = ?`;

  // Execute the first SQL query to update the comment's name
  con.query(query, commentId, (error, results) => {
    if (error) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', error);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'An error in changing comment.' });
    }

    // Check if any rows were affected by the update query
    if (results.affectedRows === 0) {
      // If no rows were affected, send a response with an error message
      return res.send({ error: 'comment not found' });
    }

    // Execute the second SQL query to update the comment's email
    con.query(query1, commentId, (err, results1) => {
      if (err) {
        // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', err);
        res.status(500);  // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'An error occurred updating comment email' });
      }

      // Execute the third SQL query to update the comment's body
      con.query(query2, commentId, (err, results2) => {
        if (err) {
           // If an error occurs during the query execution, log the error and send a response with an error message
          console.error('Error in request execution', err);
          res.status(500); // Set the response status to 500 (Internal Server Error)
          return res.send({ error: 'An error occurred updating comment body' });
        }

        res.status(200); //Set the response status to 200 (OK)
        res.send(newComment); // Send the updated comment as the response
      });
    });
  });
});


//// DELETE ////

//DELETE for todos according to id
// url example: http://localhost:3000/todos/:200

// This code defines a route handler for a DELETE request to '/todos/:id' endpoint.
// The ':id' in the route path represents a parameter that can be accessed through the 'req.params' object.
app.delete('/todos/:id', (req, res) => {

  let todoId = req.params.id;  // Extract the todoId from the request parameters
  todoId = todoId.substring(1); // Remove the leading '/' character from the todoId
  
  console.log(todoId); // Log the todoId to the console for debugging purposes
  
  // Define the SQL query to delete a todo with the given id
  const query = `DELETE FROM todos  WHERE id = ?`;

  // Execute the SQL query with the todoId as a parameter
  con.query(query, todoId, (error, results) => {
    if (error) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', error);
      res.status(500); // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'error occured while deleting todo' });
    }

    // Check if any rows were affected by the delete operation
    if (results.affectedRows === 0) {
      // If no rows were affected, send a response with an error message
      return res.send({ error: 'todo not found' });
    }

    // If a row was affected (todo deleted), send a response with the deleted todoId
    res.status(200); //Set the response status to 200 (OK)
    res.send(todoId); 
  });
});



//DELETE for post according to id
// url example: http://localhost:3000/posts/:100
// This code defines a route handler for a DELETE request to '/posts/:id' endpoint.
// The ':id' in the route path represents a parameter that can be accessed through the 'req.params' object.
app.delete('/posts/:id', (req, res) => {

  let postId = req.params.id;  // Extract the postId from the request parameters
  postId = postId.substring(1); // Remove the leading '/' character from the postId
  
  console.log(postId); // Log the postId to the console
  
  // Define the SQL query to delete a post with the specified id
  const query = `DELETE FROM posts  WHERE id = ?`;
  // Define the SQL query to delete comments associated with the post
  const query1 = `DELETE FROM comments  WHERE postId = ?`;

  // Execute the first SQL query to delete the post
  con.query(query, postId, (error, results) => {
    if (error) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', error);
      res.status(500);  // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'error occured while deleting post' });
    }

    if (results.affectedRows === 0) {
      // If no rows were affected by the delete operation, send a response with an error message
      return res.send({ error: 'post not found' });
    }

    // Execute the second SQL query to delete comments associated with the post  
    con.query(query1, postId, (error, results) => {
      if (error) {
            // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', error);
        res.status(500);  // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'error occured while deleting comments' });
      }

      if (results.affectedRows === 0) {
        // If no rows were affected by the delete operation, send a response with an error message
        return res.send({ error: 'comments not found' });
      }

      
      res.status(200); //Set the response status to 200 (OK)
      res.send({response: 'post and associated comments where deleted'}); 
      //  res.send(postId); 
    });
  });
});

// DELETE comments according to id
// url example: http://localhost:3000/comments/:500
// This code defines a route handler for a DELETE request to '/comments/:id' endpoint.
// The ':id' in the route path represents a parameter that can be accessed through the 'req.params' object.
app.delete('/comments/:id', (req, res) => {

  let commentId = req.params.id;  // Extract the commentId from the request parameters
  commentId = commentId.substring(1); // Remove the leading '/' character from the commentId
  
  // Define the SQL query to delete a comment with a specific id
  const query = `DELETE FROM comments  WHERE id = ?`;

  // Execute the SQL query with the commentId as a parameter
  con.query(query, commentId, (error, results) => {
    if (error) {
      // If an error occurs during the query execution, log the error and send a response with an error message
      console.error('Error in request execution', error);
      res.status(500);  // Set the response status to 500 (Internal Server Error)
      return res.send({ error: 'error occured while deleting comment' });
    }

    // Check if any rows were affected by the delete operation
    if (results.affectedRows === 0) {
      // If no rows were affected, send a response with an error message
      return res.send({ error: 'comment not found' });
    }

    // If the comment was successfully deleted, send a response with the deleted comment's id
    res.status(200); //Set the response status to 200 (OK)
    res.send(commentId); 
  });
});



// server starting
app.listen(3000, () => {
  console.log('Server started on port 3000.');
});


