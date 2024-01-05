const express = require('express') ; 
const { chats } = require('./data/data');
const connectDb = require('./config/db');

connectDb() ;
const app = express(); // instance of express is created 



app.get('/', (req,res) =>{
    res.send('API is running!')
})

app.get('/api/chat', (req, res)=>{
    res.send(chats);
})

app.get('/api/chat/:id', (req, res)=>{
    console.log(req.params.id)
    const singleChat = chats.find(c => c._id == req.params.id); 
    res.send(singleChat)
})

const PORT = process.env.PORT || 5000

app.listen(PORT , console.log(`Server started on port ${PORT} successfully!`)) 