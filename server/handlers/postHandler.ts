import crypto from 'crypto';

import { CreatePostRequest, CreatePostResponse, ListPostsRequest, ListPostsResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Post } from '../types';

export const listPostHandler: ExpressHandler<ListPostsRequest, ListPostsResponse> = async (
  request,
  response
) => {
  response.send({ posts: await db.listPosts() });
};

export const createPostHandler: ExpressHandler<CreatePostRequest, CreatePostResponse> = async (
  request,
  response
) => {
  if (!request.body.title || !request.body.url || !request.body.userId) {
    return response.sendStatus(400);
  }

  // TODO: validate user exists
  // TODO: get user Id from session
  // TODO: validate title and url are non-empty
  // TODO: validate url is new, otherwise add +1 to existing post
  
  const post: Post = {
    id: crypto.randomUUID(),
    postedAt: Date.now(),
    title: request.body.title,
    url: request.body.url,
    userId: request.body.userId,
  };

  await db.createPost(post);
  response.send(200);
};
