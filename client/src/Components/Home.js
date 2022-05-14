import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function Home(props) {
  const [newPost, setNewPost] = useState('');
  async function getPosts() {
      console.log('inside getposts', props);
      const token = await props.auth.getIdToken();
    axios
      .get('/api/post', {
        headers: { 'Content-Type': 'application/json', authentication2: token },
      })
      .then(({ data }) => {
          console.log(data);
        props.updatePostsState(data.posts);
        props.updateUsersState(data.users);
      });
  }

  useEffect(() => {
      console.log('inside useeffect');
    getPosts();
  }, []);

  

  async function addPost() {
    const token = await props.auth.getIdToken();
    axios
      .post(
        '/api/post',
        { id: props.currentUser.id, post: newPost },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization2: token,
          },
        }
      )
      .then(({ data }) => {
        // get back all posts
        props.updatePostsState(data.posts);
      });
  }

  return (
    <div>
      <h3>Home</h3>
      <ul>
        <li>email - {props.auth.auth.currentUser.email}</li>
        <li>uid - {props.auth.auth.currentUser.uid}</li>
      </ul>
      <div>
        {props.posts ? (props.users ? (
          Array.from(props.posts).map((post) => {
            return <div key={post.id}>
                <label>{props.users.find((user) => user.id == post.uid).username}</label>
                <div>{post.post}</div>
                </div>;
          })
        ) : <span></span>) : (
          <span></span>
        )}
      </div>
      <div>
        <label>enter a new post</label>
        <input
          type="text"
          onChange={(e) => {
            setNewPost(e.target.value);
          }}
        ></input>
        <button onClick={addPost}>post</button>
      </div>
    </div>
  );
}

export default Home;
