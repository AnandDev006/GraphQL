const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./schema/schema');
const { mongoURI } = require('../configurations/configs');

const app = express();

app.use(cors());

mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection.once('open', () =>
	console.log(`Connected to database @ ${new Date().getTime()}`)
);

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(4000, () =>
	console.log(`Listening on port 4000 @ ${new Date().getTime()}`)
);
