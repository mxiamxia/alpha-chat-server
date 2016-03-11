/**
 * Created by min on 3/11/16.
 */

var ss = require('socket.io-stream');
var fs = require('fs');

var usernames = {};
var numUsers = 0;
var counter = 0;

module.exports = function(io) {
    console.log('trying to initiate socket.io');

    io.on('connection', function (socket) {

        socket.on('add user', function (username) {
            socket.username = username;
            socket.id = generateUID();
            console.log('add user = ' + username +' , UID= ' + socket.id);
            usernames[socket.id] = username;
            numUsers++;
            socket.emit('login', {
                numUsers: numUsers
            });
            socket.broadcast.emit('user joined', {
                username: username,
                numUsers: numUsers
            });
        });

        socket.on('new message', function (data) {
            socket.broadcast.emit('new message', {
                username: socket.username,
                message: data
            });
        });

        ss(socket).on('audio', function(stream) {
            console.log('audio data received' + socket.username);
            var fileName = 'file' + socket.id + '_' +counter + '.wav';
            counter++;
            try{
                stream.pipe(fs.createWriteStream('public/audio/' + fileName));
                stream.on('end', function() {
                    console.log('file name is ' + fileName);
                    socket.broadcast.emit('new audio', {fileName:fileName, username:socket.username});
                   /* fs.readFile('file' + counter + '.wav', function(err, buf) {
                        console.log(buf.length);
                        io.sockets.emit('new audio', {audio: true, buffer: buf});
                        counter++;
                    });*/
                });
            } catch(err) {
                console.log(err);
            }
        });


    });
}

var generateUID = function() {
    return 'alpha' + Math.random().toFixed(10)*10000000000;
}