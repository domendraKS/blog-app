import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import PaginationComp from "./PaginationComp";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentIdForDelete, setCommentIdForDelete] = useState(null);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPageNo, setCurrentPageNo] = useState(1);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `/api/comment/getComments?pageNo=${currentPageNo - 1}`
      );

      if (res.data.success) {
        setComments(res.data.comments);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.user?.admin) {
      fetchComments();
    }
  }, [currentPageNo]);

  const onPageChange = (page) => setCurrentPageNo(page);

  const handleCommentDelete = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/comment/delete/${commentIdForDelete}`
      );

      if (res.data.success) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentIdForDelete)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100">
        {currentUser.user.admin && comments.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Number of Likes</Table.HeadCell>
                <Table.HeadCell>Post</Table.HeadCell>
                <Table.HeadCell>User</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {comments.map((cmt, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(cmt.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{cmt.content}</Table.Cell>
                    <Table.Cell>{cmt.numberOfLikes}</Table.Cell>
                    <Table.Cell>{cmt.postTitle}</Table.Cell>
                    <Table.Cell>{cmt.name}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdForDelete(cmt.id);
                        }}
                        className="font-medium text-red-500 cursor-pointer hover:underline"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-post/${cmt.id}`}
                        className="text-teal-500 font-medium cursor-pointer hover:underline"
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {totalPage > 1 && (
              <PaginationComp
                currentPageNo={currentPageNo}
                totalPage={totalPage}
                onPageChange={onPageChange}
              />
            )}
          </>
        ) : (
          <p>You have no comments yet..!</p>
        )}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
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
              <Button color="failure" onClick={handleCommentDelete}>
                Yes, I'm sure
              </Button>
              <Button
                className="bg-gray-400 text-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default DashComments;
