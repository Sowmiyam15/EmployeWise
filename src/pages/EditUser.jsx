import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EditUser = () => {
  const { id } = useParams(); // id from URL (string)
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`https://reqres.in/api/users/${id}`)
      .then((res) => {
        if (res.data && res.data.data) {
          let fetchedUser = res.data.data;
          const storedUpdates = JSON.parse(localStorage.getItem("updatedUsers")) || {};
          if (storedUpdates[id]) {
            fetchedUser = storedUpdates[id];
          }
          setUser(fetchedUser);
          setFirstName(fetchedUser.first_name);
          setLastName(fetchedUser.last_name);
          setEmail(fetchedUser.email);
        } else {
          loadNewUser();
        }
      })
      .catch(() => {
        loadNewUser();
      });
  }, [id]);

  const loadNewUser = () => {
    const newUsers = JSON.parse(localStorage.getItem("newUsers")) || [];
    const foundUser = newUsers.find((u) => u.id === parseInt(id) || u.id.toString() === id);
    if (foundUser) {
      setUser(foundUser);
      setFirstName(foundUser.first_name);
      setLastName(foundUser.last_name);
      setEmail(foundUser.email);
    } else {
      console.error("User not found.");
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      first_name: firstName,
      last_name: lastName,
      email: email,
    };

    const newUsers = JSON.parse(localStorage.getItem("newUsers")) || [];
    const newUserIndex = newUsers.findIndex((u) => u.id === user.id || u.id.toString() === user.id.toString());
    if (newUserIndex !== -1) {
      newUsers[newUserIndex] = updatedUser;
      localStorage.setItem("newUsers", JSON.stringify(newUsers));
    } else {
      const storedUpdates = JSON.parse(localStorage.getItem("updatedUsers")) || {};
      storedUpdates[user.id] = updatedUser;
      localStorage.setItem("updatedUsers", JSON.stringify(storedUpdates));
    }

    setMessage("User updated successfully!");
    setTimeout(() => navigate("/users"), 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">Edit User</h2>
        {message && <p className="text-green-600 text-center">{message}</p>}
        {user ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@gmail.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition duration-300 mt-2"
            >
              Back
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-700">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default EditUser;
