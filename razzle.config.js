const path = require('path');
module.exports = {
	modify: (config, { target, dev }) => {

		config.resolve['alias'] = {
			'@': path.resolve('./src'),
		}

		return config;
	}
};
