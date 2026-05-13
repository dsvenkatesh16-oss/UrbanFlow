import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Home from "./Home";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {

        if (!user) {
            navigate("/");
        }

    }, []);

    return <Home />;

}

export default Dashboard;