import React from "react";
import { FiLogOut } from "react-icons/fi";

function Logout({setUserData}) {
	const handleLogout = () => {
		console.log("hello world");
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		setUserData(null);
	};

	return (
		<button
			className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange"
			onClick={handleLogout}
			aria-label="Logout"
		>
			<FiLogOut color="#f5f5f5" /> {/* White Smoke color for the icon */}
		</button>
	);
}

export default Logout;
