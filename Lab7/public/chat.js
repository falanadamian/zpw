$(function(){
	var socket = io.connect('http://chatapp-env.eba-brdv3hwe.eu-central-1.elasticbeanstalk.com');

	var message = $("#message");
	var username = $("#username");
	var send_message = $("#send_message");
	var send_username = $("#send_username");
	var messages = $("#messages");
	var feedback = $("#feedback");

	send_message.click(function(){
		socket.emit('new_message', {message : message.val()});
	});

	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		messages.prepend(`
			<div class="media text-muted pt-3">
          		<img src="./user-image.png" class=user-image alt="User image">
          		<p class="media-body pb-3 mb-0 small lh-sm border-bottom border-gray ml-3">
            		<strong class="d-block text-gray-dark">@${data.username}</strong>
           		 	${data.message}
				</p>
				<small>${data.sent}</small>
        	</div>
		`);
	});

	send_username.click(function(){
		socket.emit('change_username', {username : username.val()});
	});

	message.bind("keypress", () => {
		socket.emit('typing');
	});

	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
	});
});


