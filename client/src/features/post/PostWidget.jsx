import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Send,
  MoreHoriz,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, InputBase, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import FlexBetween from "../../components/ui/FlexBetween";
import Friend from "../../components/ui/Friend";
import WidgetWrapper from "../../components/ui/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "../../state";
import { getImageUrl } from "../../utils/imageHelper";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUser = useSelector((state) => state.user);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  
  // Check if this is the user's own post
  const isOwnPost = postUserId === loggedInUserId;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: loggedInUserId,
          comment: `${loggedInUser.firstName} ${loggedInUser.lastName}: ${comment}`
        }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditPost = async () => {
    if (!editedDescription.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/edit`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: editedDescription.trim() }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setEditDialogOpen(false);
      setAnchorEl(null);
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Remove post from state
        const updatedPosts = posts.filter(post => post._id !== postId);
        dispatch(setPosts({ posts: updatedPosts }));
        setDeleteDialogOpen(false);
        setAnchorEl(null);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <WidgetWrapper sx={{ mb: "1rem", transition: "all 0.2s ease", "&:hover": { transform: "translateY(-1px)" } }}>
      {/* Post Header */}
      <FlexBetween>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        {isOwnPost && (
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              color: palette.neutral.medium,
              "&:hover": { backgroundColor: palette.neutral.light + "20" },
            }}
          >
            <MoreHoriz />
          </IconButton>
        )}
      </FlexBetween>
      
      {/* Post Content */}
      <Typography 
        color="text.primary" 
        sx={{ 
          mt: "0.75rem", 
          fontSize: "0.95rem",
          lineHeight: 1.5,
          wordBreak: "break-word"
        }}
      >
        {description}
      </Typography>
      
      {/* Post Image */}
      {picturePath && (
        <Box
          sx={{
            mt: "0.75rem",
            borderRadius: "12px",
            overflow: "hidden",
            border: `1px solid ${palette.neutral.light}`,
          }}
        >
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ display: "block" }}
            src={getImageUrl(picturePath)}
          />
        </Box>
      )}
      
      {/* Engagement Bar */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mt="0.75rem"
        pt="0.5rem"
        borderTop={`1px solid ${palette.neutral.light}`}
      >
        <FlexBetween gap="2rem">
          {/* Like Button */}
          <FlexBetween gap="0.5rem">
            <IconButton 
              onClick={patchLike}
              size="small"
              sx={{
                color: isLiked ? "#F91880" : palette.neutral.medium,
                "&:hover": { 
                  backgroundColor: isLiked ? "#F9188010" : palette.neutral.light + "20",
                  color: isLiked ? "#F91880" : palette.text.primary,
                },
                transition: "all 0.2s ease",
              }}
            >
              {isLiked ? (
                <FavoriteOutlined sx={{ fontSize: "1.1rem" }} />
              ) : (
                <FavoriteBorderOutlined sx={{ fontSize: "1.1rem" }} />
              )}
            </IconButton>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              {likeCount}
            </Typography>
          </FlexBetween>

          {/* Comment Button */}
          <FlexBetween gap="0.5rem">
            <IconButton 
              onClick={() => setIsComments(!isComments)}
              size="small"
              sx={{
                color: palette.neutral.medium,
                "&:hover": { 
                  backgroundColor: primary + "10",
                  color: primary,
                },
                transition: "all 0.2s ease",
              }}
            >
              <ChatBubbleOutlineOutlined sx={{ fontSize: "1.1rem" }} />
            </IconButton>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              {comments.length}
            </Typography>
          </FlexBetween>
        </FlexBetween>

        {/* Share Button */}
        <IconButton 
          size="small"
          sx={{
            color: palette.neutral.medium,
            "&:hover": { 
              backgroundColor: "#00BA7C10",
              color: "#00BA7C",
            },
            transition: "all 0.2s ease",
          }}
        >
          <ShareOutlined sx={{ fontSize: "1.1rem" }} />
        </IconButton>
      </Box>
      
      {/* Comments Section */}
      {isComments && (
        <Box mt="1rem">
          {comments.length > 0 && (
            <Box mb="1rem">
              {comments.map((comment, i) => (
                <Box key={`${name}-${i}`} mb="0.75rem">
                  <Typography 
                    variant="body2" 
                    color="text.primary"
                    sx={{ 
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                      p: "0.5rem 0.75rem",
                      backgroundColor: palette.background.alt,
                      borderRadius: "12px",
                    }}
                  >
                    {typeof comment === 'string' ? comment : comment.comment || JSON.stringify(comment)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Add Comment Input */}
          <Box display="flex" alignItems="center" gap="0.75rem">
            <InputBase
              placeholder="Tweet your reply..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                flex: 1,
                backgroundColor: palette.background.alt,
                borderRadius: "20px",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                border: `1px solid ${palette.neutral.light}`,
                "&:focus-within": {
                  borderColor: primary,
                },
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleComment();
                }
              }}
            />
            <IconButton 
              onClick={handleComment}
              disabled={!comment.trim()}
              size="small"
              sx={{ 
                backgroundColor: comment.trim() ? primary : palette.neutral.light,
                color: comment.trim() ? "white" : palette.neutral.medium,
                width: "32px",
                height: "32px",
                "&:hover": {
                  backgroundColor: comment.trim() ? palette.primary.dark : palette.neutral.light,
                },
                "&:disabled": {
                  backgroundColor: palette.neutral.light,
                  color: palette.neutral.medium,
                }
              }}
            >
              <Send sx={{ fontSize: "0.9rem" }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Post Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { setEditDialogOpen(true); setAnchorEl(null); }}>
          <Edit sx={{ mr: 1, fontSize: '1rem' }} />
          Edit Post
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialogOpen(true); setAnchorEl(null); }} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: '1rem' }} />
          Delete Post
        </MenuItem>
      </Menu>

      {/* Edit Post Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="What's on your mind?"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditPost} 
            variant="contained"
            disabled={!editedDescription.trim()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeletePost} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;
