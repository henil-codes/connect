// src/features/post/PostsWidget.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Typography } from "@mui/material"; // ← Added this

const PostsWidget = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const postsArray = Array.isArray(data.posts) ? data.posts : [];

      dispatch(setPosts({ posts: postsArray }));
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      dispatch(setPosts({ posts: [] }));
    }
  };

  useEffect(() => {
    if (token) getPosts();
  }, [token]);

  if (!Array.isArray(posts)) return null;
  if (posts.length === 0) return <Typography sx={{ mt: 2 }}>No posts yet.</Typography>;

  return (
    <>
      {posts.map((post) => (
        <PostWidget
          key={post._id}
          postId={post._id}
          postUserId={post.userId}
          name={`${post.firstName} ${post.lastName}`}
          description={post.description}
          picturePath={post.picturePath}
          userPicturePath={post.userPicturePath || post.avatar || "https://via.placeholder.com/50"}
          likes={post.likes || {}}
          comments={post.comments || []}
        />
      ))}
    </>
  );
};

export default PostsWidget;