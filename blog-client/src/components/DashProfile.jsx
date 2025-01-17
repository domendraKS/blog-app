import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import "react-circular-progressbar/dist/styles.css";
import {
  signOut,
  userDeleteFail,
  userDeleteStart,
  userDeleteSuccess,
  userUpdateFail,
  userUpdateStart,
  userUpdateSuccess,
} from "../redux/user/userSlice.js";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const filePickerRef = useRef();
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //handle form data change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value.trim() });
  };

  //handle Update User Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    //if there is no changes
    if (!imageFile && Object.keys(userData).length === 0) {
      setUpdateUserError("No Changes Made");
      return;
    }

    if (userData.password) {
      if (userData.password.trim() === "") {
        setUpdateUserError("Password cannot contain space...!");
        return;
      }
    }

    const formData = new FormData();

    formData.append(
      "userDTO",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
    formData.append("profilePic", imageFile);

    try {
      dispatch(userUpdateStart());

      const res = await fetch(`api/user/update/${currentUser.user.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(userUpdateFail(data.message));
      } else {
        setUpdateUserSuccess(data.message);
        dispatch(userUpdateSuccess(data));
      }
    } catch (error) {
      dispatch(userUpdateFail(error.message));
      return;
    }
  };

  //handle delete user
  const handleUserDelete = async () => {
    setShowModal(false);
    try {
      dispatch(userDeleteStart());
      const res = await fetch(`api/user/delete/${currentUser.user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(userDeleteFail(data.message));
      } else {
        dispatch(userDeleteSuccess());
      }
    } catch (error) {
      dispatch(userDeleteFail(error.message));
    }
  };

  //signout
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });

      if (res.ok) {
        dispatch(signOut());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h32 self-center shadow-md rounded-full overflow-hidden cursor-pointer"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={
              currentUser?.user?.profilePic &&
              typeof currentUser.user.profilePic === "string" &&
              currentUser.user.profilePic.startsWith("/userImgs")
                ? `http://localhost:3302${currentUser.user.profilePic}`
                : currentUser?.user?.profilePic || "/images/default-profile.png"
            }
            alt={`${currentUser?.user?.name}`}
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
          />
        </div>
        <TextInput
          type="text"
          id="name"
          defaultValue={currentUser.user.name}
          onChange={handleChange}
          required
        />
        <TextInput
          type="email"
          id="email"
          defaultValue={currentUser.user.email}
          onChange={handleChange}
          required
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading}
        >
          {loading ? "Loading..!" : "Update"}
        </Button>
        <div className="text-red-500 flex justify-between">
          <span className="cursor-pointer" onClick={() => setShowModal(true)}>
            Delete Account
          </span>
          <span className="cursor-pointer" onClick={handleSignout}>
            Sign Out
          </span>
        </div>
        {currentUser?.user && currentUser.user.admin && (
          <div className="flex justify-between">
            <Link to={"/create-post"}>
              <Button className="w-full" gradientDuoTone="purpleToPink">
                Create a Post
              </Button>
            </Link>
            <Link to={"/create-category"}>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-green-500 hover:to-blue-500"
                gradientDuoTone="purpleToPink"
              >
                Create a Category
              </Button>
            </Link>
          </div>
        )}
      </form>

      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
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
              Are you sure you want to delete your account ?
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
  );
};

export default DashProfile;
