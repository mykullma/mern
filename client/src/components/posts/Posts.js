import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../actions/post';

const Posts = ({ getPosts, follows, post: { posts } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>
      <PostForm />
      <div className="posts">
        {posts.map((post) => follows.filter(follow => follow.user === post.user).length > 0 && (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  post: state.post,
  follows: state.auth.user.follows
});

export default connect(mapStateToProps, { getPosts })(Posts);