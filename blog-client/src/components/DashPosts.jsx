import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import PaginationComp from "./PaginationComp";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdForDelete, setPostIdForDelete] = useState(null);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPageNo, setCurrentPageNo] = useState(1);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `/api/post/getPosts?pageNo=${currentPageNo - 1}&userId=${
          currentUser.user.id
        }`
      );

      if (res.data.success) {
        setUserPosts(res.data.posts);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.user.admin) {
      fetchPosts();
    }
  }, [currentPageNo]);

  const onPageChange = (page) => setCurrentPageNo(page);

  const handlePostDelete = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(`/api/post/delete/${postIdForDelete}`);

      if (res.data.success) {
        setUserPosts((prev) =>
          prev.filter((post) => post.id !== postIdForDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100">
        {currentUser.user.admin && userPosts.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {userPosts.map((post, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={`http://localhost:3302${post.postImg}`}
                          alt={`${post.slug}`}
                          className="w-20 h-20 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdForDelete(post.id);
                        }}
                        className="font-medium text-red-500 cursor-pointer hover:underline"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-post/${post.id}`}
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
          <p>You have no posts yet..!</p>
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
              <Button color="failure" onClick={handlePostDelete}>
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

export default DashPosts;
