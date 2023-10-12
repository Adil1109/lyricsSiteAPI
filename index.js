const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routers/authRouter');
const songsRouter = require('./routers/songsRouter');
const artistsRouter = require('./routers/artistsRouter');
const albumsRouter = require('./routers/albumsRouter');
const affiliatesRouter = require('./routers/affiliatesRouter');

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to mongodb database');
	})
	.catch((err) => {
		throw new Error();
	});

app.get('/', (req, res) => {
	res.status(200).json({ message: 'hello' });
});

app.use('/api/auth', authRouter);
app.use('/api/songs', songsRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/albums', albumsRouter);
app.use('/api/affiliates', affiliatesRouter);

app.get('*', (req, res) => {
	res.status(404).json({ success: false, message: 'Page not found!' });
});

app.listen(process.env.PORT, () => {});
