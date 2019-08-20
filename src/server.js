import Application from './Application.jsx';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import theme from './theme';


import { Users, authenticationHandler } from '@/_helpers';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server.use(express.json());
server
	.disable('x-powered-by')
	.use(express.static(process.env.RAZZLE_PUBLIC_DIR))
	.post('/*', (req, res) => {
		return authenticationHandler(req, Users).then(result => {
			res.send(JSON.stringify(result));
		},
			err => {
				console.error(err);
				res.send(err);
			}
		)

	})
	.get('/*', (req, res) => {
		const context = {};
		const sheets = new ServerStyleSheets();
		const markup = renderToString(
			sheets.collect(
				<ThemeProvider theme={theme}>
					<StaticRouter context={context} location={req.url}>
						<Application />
					</StaticRouter>
				</ThemeProvider>
			));
		const css = sheets.toString();
		if (context.url) {
			res.redirect(context.url);
		} else {
			res.status(200).send(
				`<!doctype html>
				<html lang="">
				<head>
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta charset="utf-8" />
				<title>Ovonpar Stock Ticker</title>
				<style id="jss-server-side">${css}</style>
				<meta name="viewport" content="width=device-width, initial-scale=1">
				${
				assets.client.css
					? `<link rel="stylesheet" href="${assets.client.css}">`
					: ''
				}
				${
				process.env.NODE_ENV === 'production'
					? `<script src="${assets.client.js}" defer></script>`
					: `<script src="${assets.client.js}" defer crossorigin></script>`
				}
				</head>
				<body>
				<div id="container">${markup}</div>
				</body>
				</html>`
			);
		}
	});



export default server;
