import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [parking, setParking] = useState([]);

  const [formData, setFormData] = useState({
    area_name: "",
    total_slots: "",
    available_slots: ""
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {

    if (!user) {
      navigate("/");
    }

    fetchParking();

  }, []);

  /* FETCH DATA */
  const fetchParking = () => {

    axios.get("http://localhost:5000/parking")
      .then((res) => {
        setParking(res.data);
      });

  };

  /* INPUT */
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  /* ADD / UPDATE */
  const handleSubmit = () => {

    if (editId === null) {

      axios.post("http://localhost:5000/parking", formData)
        .then(() => {

          fetchParking();

          setFormData({
            area_name: "",
            total_slots: "",
            available_slots: ""
          });

        });

    } else {

      axios.put(`http://localhost:5000/parking/${editId}`, formData)
        .then(() => {

          fetchParking();

          setEditId(null);

          setFormData({
            area_name: "",
            total_slots: "",
            available_slots: ""
          });

        });

    }

  };

  /* DELETE */
  const handleDelete = (id) => {

    axios.delete(`http://localhost:5000/parking/${id}`)
      .then(() => {
        fetchParking();
      });

  };

  /* EDIT */
  const handleEdit = (item) => {

    setEditId(item.id);

    setFormData({
      area_name: item.area_name,
      total_slots: item.total_slots,
      available_slots: item.available_slots
    });

  };

  /* LOGOUT */
  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

  };

  /* ANALYTICS */
  const totalAreas = parking.length;

  const totalSlots = parking.reduce(
    (sum, item) => sum + Number(item.total_slots),
    0
  );

  const availableSlots = parking.reduce(
    (sum, item) => sum + Number(item.available_slots),
    0
  );

  const occupiedSlots = totalSlots - availableSlots;

  const pieData = [
    { name: "Available", value: availableSlots },
    { name: "Occupied", value: occupiedSlots }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-700">

        <div>

          <h1 className="text-3xl font-bold text-cyan-400">
            UrbanFlow Dashboard
          </h1>

          <p className="text-gray-300 mt-1">
            Welcome, {user?.username}
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 px-5 py-3 rounded-xl font-bold"
        >
          Logout
        </button>

      </nav>

      <div className="p-10">

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-cyan-500 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold">Parking Areas</h2>
            <p className="text-4xl mt-3 font-bold">{totalAreas}</p>
          </div>

          <div className="bg-blue-500 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold">Total Slots</h2>
            <p className="text-4xl mt-3 font-bold">{totalSlots}</p>
          </div>

          <div className="bg-green-500 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold">Available</h2>
            <p className="text-4xl mt-3 font-bold">{availableSlots}</p>
          </div>

          <div className="bg-red-500 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold">Occupied</h2>
            <p className="text-4xl mt-3 font-bold">{occupiedSlots}</p>
          </div>

        </div>

        {/* FORM */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">

          <h2 className="text-2xl font-bold mb-6 text-cyan-300">
            {editId === null ? "Add Parking Area" : "Update Parking Area"}
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <input
              type="text"
              name="area_name"
              placeholder="Area Name"
              value={formData.area_name}
              onChange={handleChange}
              className="p-3 rounded-xl bg-slate-800 border border-gray-600 outline-none"
            />

            <input
              type="number"
              name="total_slots"
              placeholder="Total Slots"
              value={formData.total_slots}
              onChange={handleChange}
              className="p-3 rounded-xl bg-slate-800 border border-gray-600 outline-none"
            />

            <input
              type="number"
              name="available_slots"
              placeholder="Available Slots"
              value={formData.available_slots}
              onChange={handleChange}
              className="p-3 rounded-xl bg-slate-800 border border-gray-600 outline-none"
            />

          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl font-bold"
          >
            {editId === null ? "Add Parking" : "Update Parking"}
          </button>

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {/* BAR CHART */}
          <div className="bg-white/10 p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-5 text-cyan-300">
              Parking Availability
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={parking}>

                <XAxis dataKey="area_name" stroke="#fff" />

                <YAxis stroke="#fff" />

                <Tooltip />

                <Bar dataKey="available_slots" fill="#06b6d4" />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* PIE CHART */}
          <div className="bg-white/10 p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-5 text-cyan-300">
              Slot Occupancy
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >

                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          {parking.map((item) => (

            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-105 transition"
            >

              <h2 className="text-2xl font-bold text-cyan-300">
                {item.area_name}
              </h2>

              <div className="mt-4 space-y-2">

                <p className="text-lg">
                  Total Slots:
                  <span className="font-bold text-white ml-2">
                    {item.total_slots}
                  </span>
                </p>

                <p className="text-lg">
                  Available Slots:
                  <span className="font-bold text-green-400 ml-2">
                    {item.available_slots}
                  </span>
                </p>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-xl font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl font-semibold"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default Home;