import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweet.js';

export async function getTweets(req, res) {
  const username = req.query.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());

  res.status(200).json(data);
}

export async function getTweet(req, res) {
  const id = req.params.id;
  const data = await tweetRepository.getById(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.sendStatus(404);
  }
}

export async function createTweet(req, res) {
  const { text } = req.body;
  const tweet = await tweetRepository.create(text, req.userId);
  res.status(201).json(tweet);
  getSocketIO().emit('tweets', tweet);
}

export async function updateTweet(req, res) {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetRepository.getById(req.params.id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  const updated = await tweetRepository.update(id, text);
  res.status(200).json(updated);
}

export async function removeTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(req.params.id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await tweetRepository.remove(id);
  res.sendStatus(204);
}
