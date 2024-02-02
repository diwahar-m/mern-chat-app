const express = require('express') ; 
const connectDb = require('./config/db.js');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound} = require('./middleware/errorMiddleware')
const path  = require('path');

const app = express(); // instance of express is created 
connectDb() ;
app.use(express.json());

app.get('/', (req,res) =>{
    res.send('API is running!')
})

app.use('/api/user', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/message', messageRoutes)

// ------- Deployment ------- 

const __dirname1 = path.resolve(); 
if(process.env.NODE_ENV === 'production'){
    // establishing path to the frontend from current directory
    app.use(express.static(path.join(__dirname1, '/frontend/build')))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1, "frontend","build","index.html"))
    })
}else{
    app.get('/', (req,res) =>{
        res.send('API is running!')
    })
}

// ----- Deployment -----

app.use(notFound)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT , console.log(`Server started on port ${PORT} successfully!`)); 

// the following code connects our code to socket.io
const io = require("socket.io")(server,{
    pingTimeout: 60000, 
    cors:{
        origin: "http://localhost:5000"
    },
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io");
 
    // following code will receive data from the frontend
    socket.on('setup',(userData)=>{
        //creating room for particular user 
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat', (room)=>{
        socket.join(room)
        console.log('User Joined room: '+ room)
    })

    socket.on('typing',(room)=> socket.in(room).emit('typing'));
    socket.on('stop typing',(room)=> socket.in(room).emit('stop typing'));


    socket.on('new message',(newMessageReceived)=>{
        var chat = newMessageReceived.chat ;

        if(!chat.users) return console.log('chat.users not defined'); 

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return; 
            // in = means inside the user's room
            socket.in(user._id).emit('message received', newMessageReceived);
        })
    })

    socket.off("setup",()=>{
        console.log('USER DISCONNECTED');
        socket.leave(userData._id)
    })
})