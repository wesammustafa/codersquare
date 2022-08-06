import crypto from 'crypto';

import { CreatePostRequest, CreatePostResponse, ListPostsRequest, ListPostsResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Post } from '../types';

export const listPostHandler: ExpressHandler<ListPostsRequest, ListPostsResponse> = (
  request,
  response
) => {
  response.send({ posts: db.listPosts() });
};

export const createPostHandler: ExpressHandler<CreatePostRequest, CreatePostResponse> = (
  request,
  response
) => {
  if (!request.body.title) {
    return response.status(400).send('Title field is required, but missing');
  }

  if (!request.body.title || !request.body.url || !request.body.userId) {
    return response.sendStatus(400);
  }

  const post: Post = {
    id: crypto.randomUUID(),
    postedAt: Date.now(),
    title: request.body.title,
    url: request.body.url,
    userId: request.body.userId,
  };

  db.createPost(post);
  response.send(200);
};
