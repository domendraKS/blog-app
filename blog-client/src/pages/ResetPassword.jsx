import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button, TextInput, Alert } from "flowbite-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setConfirmPassword("");
        setPassword("");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          Reset Password
        </h1>
        {message && (
          <Alert color="success" className="mb-4">
            {message}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <TextInput
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <TextInput
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
        <div className="text-center mt-4 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Remembered your password?{" "}
            <a href="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
