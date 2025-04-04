//all change
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 mt-16 md:mt-24 lg:mt-32">
      <div className="flex justify-center">
        <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Update Profile</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="form-input p-3 rounded w-full bg-gray-700 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-input p-3 rounded w-full bg-gray-700 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-input p-3 rounded w-full bg-gray-700 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="form-input p-3 rounded w-full bg-gray-700 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="submit"
                className="bg-pink-500 text-white py-3 px-6 rounded hover:bg-pink-600 transition-colors w-full sm:w-auto font-medium"
              >
                Update Profile
              </button>

              <Link
                to="/user-orders"
                className="bg-pink-600 text-white py-3 px-6 rounded hover:bg-pink-700 transition-colors text-center w-full sm:w-auto font-medium"
              >
                My Orders
              </Link>
            </div>
            {loadingUpdateProfile && <div className="mt-4"><Loader /></div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;