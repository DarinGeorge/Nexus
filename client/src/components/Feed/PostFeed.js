import React from 'react';

import PostCard from './PostCard';
import BlankFeed from './BlankFeed'

export default function PostFeed({ data }) {
  console.log(data)
  return (
    <>
      {data.posts.length === 0 ? <BlankFeed /> : data.posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </>
  );
}
