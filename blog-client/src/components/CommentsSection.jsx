import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentsSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const navigate = useNavigate();
  const [commentDeleteModal, setCommentDeleteModal] = useState(false);
  const [commentDeleteId, setCommentDeleteId] = useState(null);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim().length === 0 || comment.trim().length > 200) {
      setCommentError("Fill the comment area..!");
      return;
    }
    setLoading(true);
    setCommentError(null);

    try {
      const res = await axios.post(`/api/comment/add/${postId}`, {
        content: comment,
        postId,
        userId: currentUser.user.id,
      });

      if (res.data.success) {
        setComment("");
        setCommentError(null);
        setPostComments([res.data.comment, ...postComments]);
      }
    } catch (error) {
      setCommentError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCommetns = async () => {
      try {
        const res = await axios.get(`/api/comment/${postId}`);

        if (res.data.success) {
          setPostComments(res.data.comments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCommetns();
  }, [postId]);

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await axios.put(`/api/comment/likeComment/${commentId}`);

      if (response.data.success) {
        const data = response.data.comment;
        setPostComments(
          postComments.map((commnt) =>
            commnt.id === commentId
              ? {
                  ...commnt,
                  likedByUserIds: data.likedByUserIds,
                  numberOfLikes: data.likedByUserIds.length,
                }
              : commnt
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (comment, newComment) => {
    setPostComments(
      postComments.map((c) =>
        c.id === comment.id ? { ...c, content: newComment } : c
      )
    );
  };

  const handleDelteCancel = () => {
    setCommentDeleteModal(false);
    setCommentDeleteId(null);
  };

  const handleDeleteComment = async () => {
    handleDelteCancel();

    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await axios.delete(
        `/api/comment/delete/${commentDeleteId}`
      );

      if (response.data.success) {
        setPostComments(postComments.filter((c) => c.id !== commentDeleteId));
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto w-full p-3">
        {currentUser ? (
          <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
            <p>Signed in as:</p>
            <img
              className="h-5 w-5 object-cover rounded-full"
              src={
                currentUser.user.profilePic.startsWith("/userImgs")
                  ? `http://localhost:3302${currentUser.user.profilePic}`
                  : `${currentUser.user.profilePic}`
              }
              alt={currentUser.user.name}
            />
            <Link
              to="/dashboard?tab=profile"
              className="text-xs text-cyan-500 hover:underline"
            >
              @{currentUser.user.name}
            </Link>
          </div>
        ) : (
          <div className="text-sm text-teal-500 flex gap-2">
            You must be signed in to comment.
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>
        )}
        {currentUser && (
          <form
            onSubmit={handleCommentSubmit}
            className="border border-teal-500 rounded-md p-3"
          >
            <Textarea
              placeholder="Add a comment..."
              rows={3}
              maxLength="200"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-between items-center mt-5 mb-2">
              <p className="text-gray-400 text-xs">
                {200 - comment.length} character remaining
              </p>
              <Button
                type="submit"
                outline
                gradientDuoTone="purpleToBlue"
                disabled={loading}
              >
                Submit
              </Button>
            </div>
            {commentError && <Alert color="failure">{commentError}</Alert>}
          </form>
        )}
        {postComments.length === 0 ? (
          <p className="text-sm text-center my-3 text-black dark:text-teal-400">
            No comments yet
          </p>
        ) : (
          <>
            <div className="my-3 flex items-center gap-2">
              <p className="inline">Comments </p>
              <div className="border border-gray-600 px-1 rounded-sm">
                <p> {postComments.length}</p>
              </div>
            </div>
            {postComments.map((cmt) => (
              <Comments
                key={cmt.id}
                comment={cmt}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={(commentId) => {
                  setCommentDeleteModal(true);
                  setCommentDeleteId(commentId);
                }}
              />
            ))}
          </>
        )}
      </div>
      <Modal
        show={commentDeleteModal}
        onClose={handleDelteCancel}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Are you sure you want to delete this post ?
            </h3>
          </div>
          <div className="flex flex-row-reverse gap-4">
            <Button color="failure" onClick={handleDeleteComment}>
              Yes, I'm sure
            </Button>
            <Button
              className="bg-gray-400 text-white"
              onClick={handleDelteCancel}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CommentsSection;
