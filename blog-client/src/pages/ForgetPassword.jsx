import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!email) {
      setLoading(false);
      return setError("Email is required.");
    }

    try {
      const res = await axios.post(
        "/api/auth/forget-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;

      if (!data.success) {
        setError(data.message || "Something went wrong.");
      } else {
        setMessage(
          data.message || "A reset password link has been sent to your email."
        );
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-24 p-2">
      <div className="max-w-md w-full">
        <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label value="Your email" />
            <TextInput
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>
          <Button type="submit" gradientDuoTone="cyanToBlue" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Sending...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
        {message && (
          <Alert color="success" className="mt-4">
            {message}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-4">
            {error}
          </Alert>
        )}
        <div className="text-center mt-4 text-sm">
          <Link to="/sign-in" className="text-blue-500">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
