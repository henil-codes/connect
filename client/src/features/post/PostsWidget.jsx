import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button } from "@mui/material";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);

  const getPosts = async () => {
    try {
      let endpoint;
      
      if (isProfile) {
        // Profile page - show user's posts
        endpoint = `http://localhost:3001/posts/${userId}/posts`;
      } else {
        // Home page - simple friends feed
        endpoint = `http://localhost:3001/posts/feed/${currentUser._id}`;
      }
        
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('Feed data:', data.length, 'posts');
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      dispatch(setPosts({ posts: [] }));
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
      dispatch(setPosts({ posts: [] }));
    }
  };

  useEffect(() => {
    getPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {Array.isArray(posts) && posts.length > 0 ? posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      ) : (
        !isProfile && (
          <Box
            p="2rem"
            backgroundColor="background.paper"
            borderRadius="12px"
            textAlign="center"
            border="1px solid"
            borderColor="neutral.light"
          >
            <Typography variant="h6" color="text.secondary" mb="1rem">
              No posts to show
            </Typography>
            <Typography variant="body2" color="text.secondary" mb="2rem">
              Connect with friends to see their posts in your feed!
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/find-friends'}
              sx={{
                borderRadius: "25px",
                px: "2rem"
              }}
            >
              Find Friends
            </Button>
          </Box>
        )
      )}
    </>
  );
};

export default PostsWidget;