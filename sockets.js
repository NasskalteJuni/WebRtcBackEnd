// key: id, value: user
const User = require('./models/users');


const sockets = function(io){
    io.on('connect', function(socket){

        socket.on('disconnect', function(){
            User.removeUser(socket.id);
            socket.broadcast.emit('bye');
        });

        socket.on('hello', function(msg){
            socket.broadcast.emit('hello', msg);
            socket.emit('online',User.users());
            User.addUser(socket.id, msg);
        });

        socket.on('bye', function(msg){
            User.removeUser(socket.id);
            socket.broadcast.emit  ('bye', msg);
        });

        const direct = function(type){
            return (msg) => {
                if(!(msg && msg.receiver)){
                    socket.emit('err', 'message has no receiver');
                }else if(!User.userToIdMap(msg.receiver)){
                    socket.emit('err', 'receiver '+msg.receiver+' is not online any more');
                }else{
                    try{
                        msg.sender = User.idToUserMap(socket.id);
                        msg.time = new Date().toISOString();
                        io.sockets.connected[User.userToIdMap(msg.receiver)].emit(type, msg);
                    }catch(err){
                        socket.emit('err',err);
                    }
                }
            }
        };
        socket.on('message', direct('message'));
        socket.on('ring', direct('ring'));
        socket.on('start',direct('start'));
        socket.on('ice', direct('ice'));
        socket.on('offer', direct('offer'));
        socket.on('answer', direct('answer'));
        socket.on('hangup', direct('hangup'));
    });
};

module.exports = sockets;