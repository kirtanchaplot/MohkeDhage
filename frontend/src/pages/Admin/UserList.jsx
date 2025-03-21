import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="w-full md:w-4/5 overflow-x-auto">
            {/* Mobile User Cards - Shown on small screens */}
            <div className="md:hidden">
              {users.map((user) => (
                <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">ID: {user._id}</span>
                    <span>
                      {user.isAdmin ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Admin</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">User</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="font-medium">Name:</h3>
                    {editableUserId === user._id ? (
                      <div className="flex items-center mt-1">
                        <input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 text-white py-2 px-3 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{user.username}</span>
                        <button
                          onClick={() => toggleEdit(user._id, user.username, user.email)}
                          className="ml-2 text-blue-500"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-medium">Email:</h3>
                    {editableUserId === user._id ? (
                      <div className="flex items-center mt-1">
                        <input
                          type="text"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 text-white py-2 px-3 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <a href={`mailto:${user.email}`} className="text-blue-600 dark:text-blue-400">{user.email}</a>
                        <button
                          onClick={() => toggleEdit(user._id, user.username, user.email)}
                          className="ml-2 text-blue-500"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!user.isAdmin && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Desktop Table - Hidden on small screens */}
            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">NAME</th>
                    <th className="px-4 py-2 text-left">EMAIL</th>
                    <th className="px-4 py-2 text-left">ADMIN</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-2 text-sm">{user._id}</td>
                      <td className="px-4 py-2">
                        {editableUserId === user._id ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              className="w-full p-2 border rounded-lg"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {user.username}{" "}
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                            >
                              <FaEdit className="ml-[1rem]" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editableUserId === user._id ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editableUserEmail}
                              onChange={(e) => setEditableUserEmail(e.target.value)}
                              className="w-full p-2 border rounded-lg"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <a href={`mailto:${user.email}`} className="text-blue-600 dark:text-blue-400">{user.email}</a>{" "}
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                            >
                              <FaEdit className="ml-[1rem]" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {user.isAdmin ? (
                          <FaCheck style={{ color: "green" }} />
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {!user.isAdmin && (
                          <div className="flex">
                            <button
                              onClick={() => deleteHandler(user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;



// // ⚠️⚠️⚠️ don't forget this ⚠️⚠️⚠️⚠️
// // import AdminMenu from "./AdminMenu";
