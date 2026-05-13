import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleRegister = () => {

        axios.post("http://localhost:5000/register", formData)
            .then(() => {

                alert("Registered Successfully");

                navigate("/");

            });

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-900">

            <div className="bg-white/10 p-10 rounded-2xl w-[400px]">

                <h1 className="text-3xl font-bold text-white mb-6">
                    Register
                </h1>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full p-3 mb-4 rounded-xl"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full p-3 mb-4 rounded-xl"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full p-3 mb-4 rounded-xl"
                />

                <button
                    onClick={handleRegister}
                    className="w-full bg-cyan-500 p-3 rounded-xl text-white font-bold"
                >
                    Register
                </button>

                <p className="text-white mt-5">

                    Already have account?

                    <Link
                        to="/"
                        className="text-cyan-400 ml-2"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;