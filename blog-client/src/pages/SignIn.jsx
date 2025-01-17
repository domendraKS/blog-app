import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, TextInput, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFail,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
// import OAuth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    if (!formData.email || !formData.password) {
      setError("All fiels are required");
      return dispatch(signInFail("All fiels are required"));
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 character");
      return dispatch(signInFail("Password must be at least 6 character"));
    }

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        dispatch(signInFail(data.message));
      }

      if (data.success) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
      dispatch(signInFail(error.message));
      return;
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Gevendra's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is demo project. You can sign up with your email and password
            or with google
          </p>
        </div>

        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <div className="m-2 flex flex-col gap-2 text-center">
            <div className="flex items-center my-1">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              <span className="mx-2 text-gray-500 dark:text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            {/* <OAuth /> */}
            <Link to="/forget-password" className="text-blue-500">
              Forget password ?
            </Link>
            <hr className="my-2 border-t border-gray-300 dark:border-gray-700" />
            <div className="flex gap-2 text-sm justify-center">
              <span>Don't have an account ?</span>
              <Link to="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </div>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error || "An error occurred"}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
