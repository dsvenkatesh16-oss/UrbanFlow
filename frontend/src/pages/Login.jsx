import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleLogin = () => {

        axios.post("http://localhost:5000/login", formData)
            .then((res) => {

                if (res.data.message === "Login Successful") {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(res.data.user)
                    );

                    navigate("/dashboard");

                } else {

                    alert(res.data);

                }

            });

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-900">

            <div className="bg-white/10 p-10 rounded-2xl w-[400px]">

                <h1 className="text-3xl font-bold text-white mb-6">
                    Login
                </h1>

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
                    onClick={handleLogin}
                    className="w-full bg-cyan-500 p-3 rounded-xl text-white font-bold"
                >
                    Login
                </button>

                <p className="text-white mt-5">

                    Don't have account?

                    <Link
                        to="/register"
                        className="text-cyan-400 ml-2"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;