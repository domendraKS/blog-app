import axios from "axios";
import { Button, Textarea } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comments = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(comment.content);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/getUser/${comment.user_id}`);

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUser(false);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setNewComment(comment.content);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setNewComment(comment.content);
  };

  const handleCommentSave = async (e) => {
    e.preventDefault();

    if (newComment.trim().length === 0 || newComment.trim().length > 200) {
      alert("Comment must be between 1 and 200 characters.");
      return;
    }

    try {
      const response = await axios.put(`/api/comment/update/${comment.id}`, {
        content: newComment,
      });

      if (response.data.success) {
        onEdit(comment, newComment);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loadingUser) {
    return <p>Loading user...</p>;
  }

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-400 dark:border-gray-600">
      <div className="flex-shrink-0 mr-2">
        <img
          src={
            user?.profilePic.startsWith("/userImgs")
              ? `http://localhost:3302${user?.profilePic}`
              : `${user.profilePic}`
          }
          alt={user?.name || "User"}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-xs mr-1 truncate">
            {user ? `@${user.name}` : "anonymous user"}
          </span>
          <span className="text-sm text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <form
            onSubmit={handleCommentSave}
            className="border border-teal-500 rounded-md p-2"
          >
            <Textarea
              placeholder="Edit your comment..."
              maxLength={200}
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-400 text-xs">
                {200 - newComment.length} characters remaining
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="xs"
                  outline
                  onClick={handleEditCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="xs"
                  outline
                  gradientDuoTone="purpleToBlue"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <>
            <p className="text-gray-600 pb-1">{comment.content}</p>
            <div className="text-gray-400 text-xs border-t dark:border-gray-700 pt-1 flex gap-2 items-center max-w-32">
              <button
                type="button"
                aria-label="Like comment"
                onClick={() => onLike(comment.id)}
                className={`hover:text-blue-400 ${
                  currentUser?.user &&
                  comment.likedByUserIds?.includes(currentUser.user.id) &&
                  "text-blue-500"
                }`}
              >
                <FaThumbsUp />
              </button>
              <p>
                {comment.numberOfLikes || 0}{" "}
                {comment.numberOfLikes === 1 ? "like" : "likes"}
              </p>
              {currentUser &&
                currentUser.user &&
                (comment.user_id === currentUser.user.id ||
                  currentUser.user.admin) && (
                  <>
                    <button
                      type="button"
                      aria-label="Edit comment"
                      onClick={handleEdit}
                      className="hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label="Delete comment"
                      onClick={() => onDelete(comment.id)}
                      className="hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;
