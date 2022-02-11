const hostName = "127.0.0.1";
const port = 3000;

const express = require('express');
const app = express();

const cors = require("cors");
const pool = require("./db");
const res = require('express/lib/response');

const es6render = require('express-es6-template-engine');
app.engine('html', es6render);
app.set('views', '/server/views');
app.set('view engine', 'html');

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.render('home');
});

//ROUTES//

//get all blogs
app.get("/blog", async (req,res) => {
    try {
        const allBlogs = await pool.query("SELECT * FROM blogs");

        res.json(allBlogs.rows);
    } catch (error) {
        console.error(err.message);
    }
})

//get a blog
app.get("/blog/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const blog = await pool.query(
        "SELECT * FROM blogs WHERE blog_id = $1", [id]
        );
        res.json(blog.rows[0]);
    } catch (error) {
        console.error(err.message);
    }
})
//create a blog
app.post("/blog", async (req,res) => {
    try {
        const { title, description } = req.body;
        const newBlog = await pool.query(
            "INSERT INTO blogs (title, description) VALUES ($1, $2) RETURNING *", [title, description]
        );
        res.json(newBlog.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a blog
app.put("/blog/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const { title,description } = req.body;
        const updateBlog = await pool.query(
            "UPDATE blogs SET title = $1, description = $2 WHERE blog_id = $3", [title,description,id]
        );
        res.json("Blog was updated!");
    } catch (error) {
        console.error(err.message);
    }
})

//delete a blog
app.delete("/blog/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const deleteBlog = await pool.query(
            "DELETE FROM blogs WHERE blog_id = $1", [id]
        );
        res.json("Blog was deleted!")
    } catch (error) {
        console.error(err.message);
    }
})

app.listen(port, hostName, () => {
    console.log("Server is starting on port 3000");
})