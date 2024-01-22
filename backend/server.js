const express = require('express') ; 
const connectDb = require('./config/db.js');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound} = require('./middleware/errorMiddleware')

const app = express(); // instance of express is created 
connectDb() ;
app.use(express.json());

app.get('/', (req,res) =>{
    res.send('API is running!')
})

app.use('/api/user', userRoutes)
app.use('/api/chats', chatRoutes)

app.use(notFound)

const PORT = process.env.PORT || 5000

app.listen(PORT , console.log(`Server started on port ${PORT} successfully!`)) 