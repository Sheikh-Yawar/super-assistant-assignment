import { useNavigate } from "react-router-dom";
import "../styles/chooseAuthentication.css";
import { useEffect } from "react";
import Cookies from "js-cookie";

function ChooseAuthentication() {
	const navigate = useNavigate();

	useEffect(() => {
		const tokenExpiry = Cookies.get("expiryTime");
		if (tokenExpiry === undefined) {
			return;
		}
		console.log("Hello");
		const currentTime = new Date().getTime();
		console.log(currentTime, tokenExpiry);
		if (tokenExpiry > currentTime) {
			navigate("/builder", { replace: true });
		}
	}, []);

	const handleSignupClick = () => {
		navigate("/signup");
	};

	const handleLoginClick = () => {
		navigate("/login");
	};
	return (
		<div className="authenticateContainer">
			<div className="authenticateBox">
				<button onClick={handleSignupClick} className="saveQuestion">
					Signup
				</button>
				<button onClick={handleLoginClick} className="saveQuestion">
					Login
				</button>
			</div>
		</div>
	);
}

export default ChooseAuthentication;
