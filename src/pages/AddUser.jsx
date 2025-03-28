import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Store image as Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      first_name: firstName,
      last_name: lastName,
      email: email,
      avatar: avatar || "https://tse4.mm.bing.net/th?id=OIP.Y64zo6idinAtdWb-NOktKQHaHa&pid=Api&P=0&h=180", // Default if no image
    };

    // Store in localStorage
    const storedNewUsers = JSON.parse(localStorage.getItem("newUsers")) || [];
    storedNewUsers.push(newUser);
    localStorage.setItem("newUsers", JSON.stringify(storedNewUsers));

    setMessage("User added successfully!");
    setTimeout(() => navigate("/users"), 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4 w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Add New User
        </h2>
        {message && <p className="text-green-600 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Email (Gmail)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
              placeholder="example@gmail.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Image URL (Optional)
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Enter image URL"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Upload Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Show Image */}
          {avatar && (
            <div className="flex justify-center">
              <img
                src={avatar}
                alt="User Preview"
                className="w-24 h-24 mt-2 rounded-full border border-gray-300"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add User
          </button>
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition duration-300 mt-2"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;

