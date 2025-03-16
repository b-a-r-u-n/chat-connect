import { log } from 'console';
import {createServer} from 'http';
import {Server} from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, { 
    cors: {
        origin: '*'
    }
})

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("a new client connected", socket.id);

    console.log("Check online users", onlineUsers);
    

    // Add a new user
    socket.on("add-new-user", (payload) => {
        if(!onlineUsers.some((user) => user?.userId === payload.userId)){
            onlineUsers = [...onlineUsers, {userId: payload.userId, socketId: socket.id}]
        }
        // console.log("onlineUsers", onlineUsers);
        
        io.emit('get-users', onlineUsers);
    })

    // Send message
    socket.on('send-message', (payload) => {
        // console.log('message received', payload);
        const {receiverId} = payload;
        
        const user = onlineUsers.find((user) => String(user.userId) === String(receiverId));

        if(user){
            io.to(user.socketId).emit('receive-message', payload)
        }
        
    })

    socket.on("disconnect", () => {
        console.log("a client disconnected", socket.id);
        // Remove the user from the online users list
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit('get-users', onlineUsers);
    })
})

httpServer.listen(8080, "0.0.0.0", () => {
    console.log('listening on *:8080');
})