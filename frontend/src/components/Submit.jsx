import { useNavigate } from "react-router-dom";
import "../styles/Submit.css";

function Submit() {
	const navigate = useNavigate();
	const handleButtonClick = () => {
		navigate("/builder", { replace: true });
	};

	return (
		<div className="submitContainer">
			<div className="submitBox">
				<div>Your response has been submitted.</div>
				<button onClick={handleButtonClick}>Home Page</button>
			</div>
		</div>
	);
}

export default Submit;
