import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Table, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import PaginationComp from "./PaginationComp";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdForDelete, setUserIdForDelete] = useState(null);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPageNo, setCurrentPageNo] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `/api/user/getAllUser?pageNo=${currentPageNo - 1}`
      );

      if (res.data.success) {
        setUsers(res.data.users);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.user.admin) {
      fetchUsers();
    }
  }, [currentPageNo]);

  const onPageChange = (page) => setCurrentPageNo(page);

  const handleUserDelete = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(`/api/user/delete/${userIdForDelete}`);

      if (res.data.success) {
        setUsers((prev) => prev.filter((user) => user.id !== userIdForDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100">
        {currentUser.user.admin && users.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Created Date</Table.HeadCell>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {users.map((user, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={`http://localhost:3302${user.profilePic}`}
                        alt={`${user.name}`}
                        className="w-10 h-10 object-cover bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      {user.admin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdForDelete(user.id);
                        }}
                        className="font-medium text-red-500 cursor-pointer hover:underline"
                      >
                        Delete
                      </span>
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
          <p>You have no users yet..!</p>
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
                Are you sure you want to delete this user ?
              </h3>
            </div>
            <div className="flex flex-row-reverse gap-4">
              <Button color="failure" onClick={handleUserDelete}>
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

export default DashUsers;
