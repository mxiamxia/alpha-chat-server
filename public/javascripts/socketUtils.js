/**
 * Created by mxia on 10/29/2015.
 */
var socket = io.connect('http://192.168.254.122:3003');

socket.emit('add user', 'coc-agent' + Math.random().toFixed(2)*100);

socket.on('new message', function(data){
    //$('#log').innerHTML += "\n" + 'Received ' + data.message;
    //$('#log').html(data.message);
    document.getElementById("log").innerHTML += "\n" + 'Received '  + data.message + ' from ' +  data.username;
});
