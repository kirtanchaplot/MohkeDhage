//all change
// Login.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res,token: res.token || res._id  }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row justify-center p-4 md:p-0">
      {/* Form section */}
      <div className="w-full md:w-1/2 lg:w-1/3 md:p-8 lg:p-12 flex flex-col justify-center">
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg max-w-md mx-auto w-full">
          <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-white text-center">Welcome Back</h1>
          <p className="text-gray-400 text-center mb-8">Please sign in to your account</p>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition duration-300 mt-6 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isLoading && <div className="flex justify-center mt-4"><Loader /></div>}
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                New Customer?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-pink-400 hover:text-pink-300 transition duration-200 font-medium"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image section - hidden on mobile */}
      <div className="hidden md:block md:w-1/2 lg:w-2/3 relative">
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt="Fashion"
          className="h-screen w-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-white text-center px-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Store</h2>
            <p className="text-xl md:text-2xl">Discover amazing products and great deals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;