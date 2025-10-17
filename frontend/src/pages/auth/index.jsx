import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Validation
  const validate = () => {
    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");
    if (isSignUp && password !== confirmPassword)
      return toast.error("Passwords do not match");
    return true;
  };

  // ✅ Login
  const handleLogin = async () => {
    if (!validate()) return;
    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.user) {
        Cookies.set("user", JSON.stringify(response.data.user));
        Cookies.set("jwt", response.data.user.token);
        setUserInfo(response.data.user);
        navigate(response.data.user.profileSetup ? "/chat" : "/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  // ✅ Signup
  const handleSignup = async () => {
    if (!validate()) return;
    try {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 201) {
        Cookies.set("user", JSON.stringify(response.data.user));
        Cookies.set("jwt", response.data.user.token);
        setUserInfo(response.data.user);
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a0b2e] via-[#301934] to-[#5e2b97]">
      {/* Purple glowing aura */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-purple-600 rounded-full blur-[200px] opacity-20"></div>
      </div>

      {/* Auth container */}
      <div className="relative w-[900px] h-[550px] bg-[#1f1333]/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(128,0,255,0.3)] transition-all duration-700 border border-purple-700/30">
        {/* Sign In */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center p-10 transition-all duration-700 ${
            isSignUp
              ? "translate-x-[100%] opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-72 mb-4 p-3 rounded-lg bg-[#2a1d4f] text-white border border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-72 mb-6 p-3 rounded-lg bg-[#2a1d4f] text-white border border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleLogin}
            className="w-72 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:opacity-90 transition"
          >
            SIGN IN
          </button>
        </div>

        {/* Sign Up */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center p-10 transition-all duration-700 ${
            isSignUp
              ? "translate-x-[100%] opacity-100"
              : "opacity-0 -translate-x-[100%]"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Create Account</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-72 mb-4 p-3 rounded-lg bg-[#2a1d4f] text-white border border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-72 mb-4 p-3 rounded-lg bg-[#2a1d4f] text-white border border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-72 mb-6 p-3 rounded-lg bg-[#2a1d4f] text-white border border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSignup}
            className="w-72 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:opacity-90 transition"
          >
            SIGN UP
          </button>
        </div>

        {/* Sliding Panel */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white flex flex-col items-center justify-center text-center p-12 transition-transform duration-700 ${
            isSignUp ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          {isSignUp ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-sm mb-6 opacity-90">
                To stay connected with us, please login with your credentials
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="px-8 py-3 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-purple-700 transition"
              >
                SIGN IN
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
              <p className="text-sm mb-6 opacity-90">
                Enter your details and start your journey with us
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="px-8 py-3 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-purple-700 transition"
              >
                SIGN UP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
