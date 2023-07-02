

// database creation
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE db_project6", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });


var mysql = require('mysql2');
const http = require('http');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Neraph1902",
  database: "db_project6"
});


// execute SQL query 
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    con.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// insert comment
async function insertComment(comment) {
  const { postId, name, email, body } = comment;

  const query = `INSERT INTO comments (postId, name, email, body) VALUES (${postId}, '${name}', '${email}', '${body}')`;
  await executeQuery(query);
}

//insert post
async function insertPost(post) {
  const { userId, title, body } = post;

  const query = `INSERT INTO posts (userId, title, body) VALUES (${userId}, '${title}', '${body}')`;
  await executeQuery(query);
}

// insert todos
async function insertTodo(todo) {
  const { userId, title, completed } = todo;

  const query = `INSERT INTO todos (userId, title, completed) VALUES (${userId}, '${title}', ${completed})`;
  await executeQuery(query);
}

// insert user 
async function insertUser(user) {
  const { name, username, email, address, phone, website } = user;
  const { street, suite, city } = address;

  const query = `INSERT INTO users (name, username, email, street, suite, city, phone, website) VALUES ('${name}', '${username}', '${email}', '${street}', '${suite}', '${city}', '${phone}', '${website}')`;
  await executeQuery(query);
}

// generate password
function generatePassword() {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

// insert object to users_passwords table
async function insertUserPassword(userId, password) {
  const query = `INSERT INTO users_passwords (userId, password) VALUES (${userId}, '${password}')`;
  await executeQuery(query);
}


// insert album
async function insertAlbum(album) {
  const { userId, id, title } = album;

  const query = `INSERT INTO albums (userId, id, title) VALUES (${userId}, ${id}, '${title}')`;
  await executeQuery(query);
}

// insert photo
async function insertPhoto(photo) {
  const { albumId, id, title, url, thumbnailUrl } = photo;

  const query = `INSERT INTO photos (albumId, id, title, url, thumbnailUrl) VALUES (${albumId}, ${id}, '${title}', '${url}', '${thumbnailUrl}')`;
  await executeQuery(query);
}

// get data from the URL
function fetchData(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function createTables() {
  try {
    // Create comments table
    await executeQuery('CREATE TABLE IF NOT EXISTS comments (id INT AUTO_INCREMENT PRIMARY KEY, postId INT, name VARCHAR(255), email VARCHAR(255), body TEXT)');
    
    // Create posts table
    await executeQuery('CREATE TABLE IF NOT EXISTS posts (id INT AUTO_INCREMENT PRIMARY KEY, userId INT, title VARCHAR(255), body TEXT)');

    // Create todos tabke
    await executeQuery('CREATE TABLE IF NOT EXISTS todos (id INT AUTO_INCREMENT PRIMARY KEY, userId INT, title VARCHAR(255), completed BOOLEAN)');

    // Create users table
    await executeQuery('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255) UNIQUE, email VARCHAR(255), street VARCHAR(255), suite VARCHAR(255), city VARCHAR(255), phone VARCHAR(255), website VARCHAR(255))');

    // Create users_passwords table
    await executeQuery('CREATE TABLE IF NOT EXISTS users_passwords (userId INT PRIMARY KEY, password VARCHAR(255))');

    
    // Create albums table
    await executeQuery('CREATE TABLE IF NOT EXISTS albums (id INT AUTO_INCREMENT PRIMARY KEY, userId INT, title VARCHAR(255))');

    // Create photos table
    await executeQuery('CREATE TABLE IF NOT EXISTS photos (id INT AUTO_INCREMENT PRIMARY KEY, albumId INT, title VARCHAR(255), url VARCHAR(255), thumbnailUrl VARCHAR(255))');


    // Récupération des données et insertion dans la table "comments"
    const comments = await fetchData('http://jsonplaceholder.typicode.com/comments');
    for (const comment of comments) {
      await insertComment(comment);
    }

    // get data from the URL et put in posts table
    const posts = await fetchData('http://jsonplaceholder.typicode.com/posts');
    for (const post of posts) {
      await insertPost(post);
    }

    // get data from the URL et put in todos table
    const todos = await fetchData('http://jsonplaceholder.typicode.com/todos');
    for (const todo of todos) {
      await insertTodo(todo);
    }

    // get data from the URL et put in users table
    const users = await fetchData('http://jsonplaceholder.typicode.com/users');
    for (const user of users) {
      await insertUser(user);
      const password = generatePassword();
      await insertUserPassword(user.id, password);
    }

    // get data from the URL et put in albums table
    const albums = await fetchData('http://jsonplaceholder.typicode.com/albums');
    for (const album of albums) {
      await insertAlbum(album);
    }

    // get data from the URL et put in photos table
    const photos = await fetchData('http://jsonplaceholder.typicode.com/photos');
    for (const photo of photos) {
      await insertPhoto(photo);
    }


    // end connection
    con.end();
    console.log('Tables "comments", "posts", "todos", "users", "users_passwords" , "albums", and "photos" created.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create tables and insert data 
createTables();







// var mysql = require('mysql2');
// const http = require('http');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Neraph1902",
//   database: "db_project6"
// });

// // Création d'une connexion à la base de données
// // const connection = mysql.createConnection(con);

// // Fonction pour exécuter une requête SQL
// function executeQuery(query) {
//   return new Promise((resolve, reject) => {
//     con.query(query, (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

// // Fonction pour insérer un objet dans la table "comments"
// async function insertComment(comment) {
//   const { postId, id, name, email, body } = comment;

//   const query = `INSERT INTO comments (postId, id, name, email, body) VALUES (${postId}, ${id}, '${name}', '${email}', '${body}')`;
//   await executeQuery(query);
// }

// // Fonction pour insérer un objet dans la table "posts"
// async function insertPost(post) {
//   const { userId, id, title, body } = post;

//   const query = `INSERT INTO posts (userId, id, title, body) VALUES (${userId}, ${id}, '${title}', '${body}')`;
//   await executeQuery(query);
// }

// // Fonction pour insérer un objet dans la table "todos"
// async function insertTodo(todo) {
//   const { userId, id, title, completed } = todo;

//   const query = `INSERT INTO todos (userId, id, title, completed) VALUES (${userId}, ${id}, '${title}', ${completed})`;
//   await executeQuery(query);
// }

// // Fonction pour insérer un objet dans la table "users"
// async function insertUser(user) {
//   const { id, name, username, email, address, phone, website } = user;
//   const { street, suite, city } = address;

//   const query = `INSERT INTO users (id, name, username, email, street, suite, city, phone, website) VALUES (${id}, '${name}', '${username}', '${email}', '${street}', '${suite}', '${city}', '${phone}', '${website}')`;
//   await executeQuery(query);
// }

// // Fonction pour générer un mot de passe aléatoire
// function generatePassword() {
//   const length = 8;
//   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let password = '';

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * charset.length);
//     password += charset.charAt(randomIndex);
//   }

//   return password;
// }

// // Fonction pour insérer un objet dans la table "users_passwords"
// async function insertUserPassword(userId, password) {
//   const query = `INSERT INTO users_passwords (userId, password) VALUES (${userId}, '${password}')`;
//   await executeQuery(query);
// }

// // Fonction pour récupérer les données à partir de l'URL JSONPlaceholder
// function fetchData(url) {
//   return new Promise((resolve, reject) => {
//     http.get(url, (res) => {
//       let data = '';

//       res.on('data', (chunk) => {
//         data += chunk;
//       });

//       res.on('end', () => {
//         resolve(JSON.parse(data));
//       });
//     }).on('error', (error) => {
//       reject(error);
//     });
//   });
// }

// async function createTables() {
//   try {
//     // Création de la table "comments"
//     await executeQuery('CREATE TABLE IF NOT EXISTS comments (postId INT, id INT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), body TEXT)');
    
//     // Création de la table "posts"
//     await executeQuery('CREATE TABLE IF NOT EXISTS posts (userId INT, id INT PRIMARY KEY, title VARCHAR(255), body TEXT)');

//     // Création de la table "todos"
//     await executeQuery('CREATE TABLE IF NOT EXISTS todos (userId INT, id INT PRIMARY KEY, title VARCHAR(255), completed BOOLEAN)');

//     // Création de la table "users"
//     await executeQuery('CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255), email VARCHAR(255), street VARCHAR(255), suite VARCHAR(255), city VARCHAR(255), phone VARCHAR(255), website VARCHAR(255))');

//     // Création de la table "users_passwords"
//     await executeQuery('CREATE TABLE IF NOT EXISTS users_passwords (userId INT PRIMARY KEY, password VARCHAR(255))');

//     // Récupération des données et insertion dans la table "comments"
//     const comments = await fetchData('http://jsonplaceholder.typicode.com/comments');
//     for (const comment of comments) {
//       await insertComment(comment);
//     }

//     // Récupération des données et insertion dans la table "posts"
//     const posts = await fetchData('http://jsonplaceholder.typicode.com/posts');
//     for (const post of posts) {
//       await insertPost(post);
//     }

//     // Récupération des données et insertion dans la table "todos"
//     const todos = await fetchData('http://jsonplaceholder.typicode.com/todos');
//     for (const todo of todos) {
//       await insertTodo(todo);
//     }

//     // Récupération des données et insertion dans la table "users"
//     const users = await fetchData('http://jsonplaceholder.typicode.com/users');
//     for (const user of users) {
//       await insertUser(user);
//       const password = generatePassword();
//       await insertUserPassword(user.id, password);
//     }

//     // Fermeture de la connexion à la base de données
//     con.end();
//     console.log('Tables "comments", "posts", "todos", "users" et "users_passwords" créées et remplies avec succès.');
//   } catch (error) {
//     console.error('Une erreur s\'est produite :', error);
//   }
// }

// // Appel de la fonction pour créer les tables et insérer les données
// createTables();


  