import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/ui/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/ui/UserImage";
import WidgetWrapper from "../../components/ui/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [error, setError] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const MAX_POST_LENGTH = 500;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handlePost = async () => {
    // Validation
    if (!post.trim()) {
      setError("Post cannot be empty");
      return;
    }
    
    if (post.length > MAX_POST_LENGTH) {
      setError(`Post must be ${MAX_POST_LENGTH} characters or less`);
      return;
    }

    if (image && image.size > MAX_FILE_SIZE) {
      setError("Image must be less than 5MB");
      return;
    }

    try {
      setError("");
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post.trim());
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }

      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const posts = await response.json();
      dispatch(setPosts({ posts: Array.isArray(posts) ? posts : [] }));
      setImage(null);
      setPost("");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    }
  };

  return (
    <WidgetWrapper sx={{ mb: "1rem" }}>
      {/* Main Compose Area */}
      <FlexBetween gap="1rem" alignItems="flex-start">
        <UserImage image={picturePath} size="40px" />
        <Box flex={1}>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: "0.5rem" }}>
              {error}
            </Typography>
          )}
          <InputBase
            placeholder="What's happening?"
            onChange={(e) => {
              setPost(e.target.value);
              setError("");
            }}
            value={post}
            multiline
            maxRows={6}
            sx={{
              width: "100%",
              fontSize: "1.25rem",
              lineHeight: 1.5,
              "& .MuiInputBase-input": {
                padding: "0.75rem 0",
                "&::placeholder": {
                  color: palette.neutral.medium,
                  fontSize: "1.25rem",
                },
              },
            }}
          />
          <Typography 
            variant="caption" 
            color={post.length > MAX_POST_LENGTH ? "error" : "text.secondary"}
            sx={{ display: "block", mt: "0.25rem" }}
          >
            {post.length}/{MAX_POST_LENGTH}
          </Typography>
          
          {/* Image Upload Area */}
          {isImage && (
            <Box
              mt="1rem"
              border={`2px dashed ${palette.primary.main}`}
              borderRadius="12px"
              p="1rem"
            >
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png,.gif,.webp"
                maxSize={MAX_FILE_SIZE}
                multiple={false}
                onDrop={(acceptedFiles, rejectedFiles) => {
                  if (rejectedFiles.length > 0) {
                    const rejection = rejectedFiles[0];
                    if (rejection.file.size > MAX_FILE_SIZE) {
                      setError("Image must be less than 5MB");
                    } else {
                      setError("Invalid file type. Please upload an image (jpg, png, gif, webp)");
                    }
                  } else {
                    setImage(acceptedFiles[0]);
                    setError("");
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <Box>
                    <Box
                      {...getRootProps()}
                      sx={{ 
                        cursor: "pointer",
                        textAlign: "center",
                        py: "2rem",
                      }}
                    >
                      <input {...getInputProps()} />
                      {!image ? (
                        <Typography color="primary" variant="body1">
                          Click or drag to add an image
                        </Typography>
                      ) : (
                        <FlexBetween>
                          <Typography variant="body2">{image.name}</Typography>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setImage(null);
                            }}
                            size="small"
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </FlexBetween>
                      )}
                    </Box>
                  </Box>
                )}
              </Dropzone>
            </Box>
          )}
        </Box>
      </FlexBetween>

      {/* Action Bar */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mt="1rem"
        pt="0.75rem"
        borderTop={`1px solid ${palette.neutral.light}`}
      >
        <FlexBetween gap="1rem">
          {/* Media Options */}
          <IconButton 
            onClick={() => setIsImage(!isImage)}
            size="small"
            sx={{
              color: palette.primary.main,
              "&:hover": { backgroundColor: palette.primary.main + "10" },
            }}
          >
            <ImageOutlined />
          </IconButton>

          {isNonMobileScreens && (
            <>
              <IconButton 
                size="small"
                sx={{
                  color: palette.primary.main,
                  "&:hover": { backgroundColor: palette.primary.main + "10" },
                }}
              >
                <GifBoxOutlined />
              </IconButton>

              <IconButton 
                size="small"
                sx={{
                  color: palette.primary.main,
                  "&:hover": { backgroundColor: palette.primary.main + "10" },
                }}
              >
                <AttachFileOutlined />
              </IconButton>

              <IconButton 
                size="small"
                sx={{
                  color: palette.primary.main,
                  "&:hover": { backgroundColor: palette.primary.main + "10" },
                }}
              >
                <MicOutlined />
              </IconButton>
            </>
          )}
        </FlexBetween>

        {/* Post Button */}
        <Button
          disabled={!post.trim() || post.length > MAX_POST_LENGTH}
          onClick={handlePost}
          variant="contained"
          sx={{
            backgroundColor: palette.primary.main,
            color: "white",
            borderRadius: "25px",
            px: "2rem",
            py: "0.5rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: palette.primary.dark,
            },
            "&:disabled": {
              backgroundColor: palette.neutral.light,
              color: palette.neutral.medium,
            },
          }}
        >
          Post
        </Button>
      </Box>
    </WidgetWrapper>
  );
};

export default MyPostWidget;