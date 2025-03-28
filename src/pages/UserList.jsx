import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";


const UsersList = ({ onLogout }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(`https://reqres.in/api/users?page=${page}`)
      .then((res) => {
        const apiUsers = res.data.data;
        setTotalPages(res.data.total_pages);

        const storedUpdates = JSON.parse(localStorage.getItem("updatedUsers")) || {};
        const deletedUsers = JSON.parse(localStorage.getItem("deletedUsers")) || [];

        const filteredApiUsers = apiUsers.filter(
          (user) => !deletedUsers.includes(user.id)
        );

        const mergedUsers = filteredApiUsers.map(
          (user) => storedUpdates[user.id] || user
        );

        if (page === 1) {
          const newUsers = JSON.parse(localStorage.getItem("newUsers")) || [];
          setUsers([...newUsers, ...mergedUsers]);
        } else {
          setUsers(mergedUsers);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [page]);

  const handleDelete = (userId) => {
    let newUsers = JSON.parse(localStorage.getItem("newUsers")) || [];
    newUsers = newUsers.filter((user) => user.id !== userId);
    localStorage.setItem("newUsers", JSON.stringify(newUsers));

    const deletedUsers = JSON.parse(localStorage.getItem("deletedUsers")) || [];
    if (!deletedUsers.includes(userId)) {
      deletedUsers.push(userId);
      localStorage.setItem("deletedUsers", JSON.stringify(deletedUsers));
    }

    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-5xl bg-blue-600 shadow-lg rounded-lg p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-3 sm:mb-0">User List</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onLogout();
                navigate("/");
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/add-user")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
            >
              Add User
            </button>
          </div>
        </div>

        {/* User Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {users.length > 0 ? (
            users.map((user) => (
              <motion.div
                key={user.id}
                className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center text-center border-2 border-indigo-600"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.img
                  src={user.avatar}
                  alt={user.first_name}
                  className="w-20 h-20 rounded-full border-2 border-indigo-500 mb-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <h3 className="text-lg font-semibold text-gray-700">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/edit/${user.id}`)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No users found for this page.
            </p>
          )}
        </motion.div>

        {/* Pagination Controls */}
        <motion.div 
          className="mt-8 flex flex-wrap justify-center items-center gap-2 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 min-w-[40px] rounded-full font-semibold shadow-lg ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
            whileHover={{ scale: page === 1 ? 1 : 1.1 }}
          >
            ◀ Prev
          </motion.button>

          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`px-3 py-2 min-w-[40px] text-sm md:text-base rounded-full font-semibold shadow-md ${
                  page === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>

          <motion.button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 min-w-[40px] rounded-full font-semibold shadow-lg ${
              page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
            whileHover={{ scale: page === totalPages ? 1 : 1.1 }}
          >
            Next ▶
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UsersList;
