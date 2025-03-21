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
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row justify-center p-4 md:p-0">
      {/* Form section */}
      <div className="w-full md:w-1/2 lg:w-1/3 md:p-8 lg:p-12 flex flex-col justify-center">
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-6 text-white text-center">Sign In</h1>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-300 mt-6"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isLoading && <div className="flex justify-center mt-4"><Loader /></div>}
            
            <div className="mt-4 text-center">
              <p className="text-gray-300">
                New Customer?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-pink-400 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image section - hidden on mobile */}
      <div className="hidden md:block md:w-1/2 lg:w-2/3">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt="Fashion"
          className="h-screen w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;