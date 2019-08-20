export function authenticationHandler(req, Users) {

	const isLoggedIn = req.header('OST') !== 'undefined';

	return new Promise((resolve, reject) => {

		
			if (req.url.endsWith('/v1/login') && req.method === 'POST') {
				const params = req.body;
				const user = Users.get().find(x => x.username === params.username && x.password === params.password);
				if (!user) return error('Username or password is incorrect');
				return ok({
					id: user.id,
					username: user.username,
					token: 'OST Key'
				});
			}

		
			if (req.url.endsWith('/users') && req.method === 'POST') {
				if (!isLoggedIn) return unauthorised();
				return ok(Users.get());
			}

		
			if (req.url.endsWith('/user') && req.method === 'POST') {
				const params = req.body;
				const users = Users.get();
				const user = users.find(x => x.username === params.username);
				if (user) return error('User exists');
				users[users.length] = { id: users.length + 1, username: params.username, password: params.password }
				return ok({})
			}


			if (req.url.endsWith('/login/genhash') && req.method === 'POST') {
				const params = req.body;
				const user = Users.get().find(x => x.username === params.username);
				if (!user) return error('User not found');
				let genhash = makeid();
				let gentimestamp = new Date().getTime() + 3600000;
				let reset = { username: params.username, hash: genhash, timestamp: gentimestamp }
				Users.setResetRef(reset);
				return ok({ genhash })
			}

		
			if (req.url.endsWith('/users/authenticate/reset') && req.method === 'POST') {
				const params = req.body;
				const user = Users.get().find(x => x.username === params.username);
				if (!user) return error('Username is incorrect');
				const reset = Users.resetRef();
				if (!reset) return error('Authentication token is incorrect');

				if (!(reset.username === user.username) || !(reset.hash === params.genhash)) return error('Authentication token is incorrect');
				const timestamp = reset.timestamp;
				if (new Date().getTime() > timestamp) return error('Authentication token is incorrect');

				user.password = params.password;
				return ok({
					id: user.id,
					username: user.username,
					token: 'OST Key'
				});
			}

			reject('Api not defined');

			function ok(body) {
				resolve({ status: 200, message: body})
			}

			function unauthorised() {
				resolve({ status: 401, message: 'Unauthorised' })
			}

			function error(message) {
				resolve({ status: 400, message })
			}
		
	});

}

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 10; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

