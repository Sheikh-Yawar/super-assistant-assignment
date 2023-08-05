import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styles/authenticate.css";

function Authenticate({ action }) {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async () => {
		console.log(username, password);
		if (username === "" || password === "") {
			toast.error("Please fill all the details", {
				position: "top-right",
				autoClose: 3000,
			});
			return;
		}
		try {
			setIsLoading(true);
			const updatedAction = action.toLowerCase();
			const response = await fetch(`http://localhost:3000/${updatedAction}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: username, password: password }),
			});
			const data = await response.json();

			if (response.status === 409) {
				toast.error(data.message, {
					position: "top-right",
					autoClose: 3000,
				});
			} else if (response.status === 401) {
				toast.error(data.message, {
					position: "top-right",
					autoClose: 3000,
				});
			} else {
				Cookies.set("token", data.token);
				Cookies.set("expiryTime", new Date().getTime() + 6 * 60 * 60 * 1000);
				navigate("/builder", { replace: true });
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setUsername("");
			setPassword("");
			setIsLoading(false);
		}
	};

	return (
		<div className="authenticateContainer">
			<div className="authenticateBox">
				<div className="fields">
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={handleUsernameChange}
					/>
					<input
						type="text"
						placeholder="password"
						value={password}
						onChange={handlePasswordChange}
					/>
					<button className="saveQuestion" onClick={handleSubmit}>
						{isLoading ? (
							<ThreeDots color="#ffffff" height={15} width={50} />
						) : (
							action
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Authenticate;
