const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db.js");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES
//post a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body; //destructure the request body
    const newTodo = await pool.query(
      "INSERT INTO todos (description) VALUES($1) RETURNING *", //insert into the table todos the description
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todos");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todos WHERE todo_id = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todos SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("Todo was updated");
  } catch (error) {
    console.error(error.message);
  }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM todos WHERE todo_id = $1",
      [id]
    );
    res.json("Todo was deleted");
  } catch (error) {
    console.error(error.message);
  }
});
app.listen(6000, () => {
  console.log("Server is running on port 6000");
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to the database");
    }
  });
});
