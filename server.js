require('dotenv').config();

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const secretKey = 'mysecretkey';

app.use(express.json())

const posts = [
    {
        username:"Kyle",
        password:"a1234",
        title: 'Post 1'
    },
    {
        username:"Jim",
        password:"b1234",
        title: 'Post 2'
    }
    
]

app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter(post => post.username === req.user.name && post.password === req.user.password))
})


app.post('/login', (req,res)=> {
    const username = req.body.username
    const password = req.body.password
    const user = { name: username, password: password}


    const accessToken = jwt.sign(user, secretKey)
    res.json({ accessToken })
})

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null ) { 
        return res.sendStatus(401)
    }
    jwt.verify(token, secretKey, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000);
console.log("Server listening port")