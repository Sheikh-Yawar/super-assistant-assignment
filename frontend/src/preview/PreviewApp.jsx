import Cookies from "js-cookie";
import CatagorizeQuestionPreview from "./components/CategoriseQuestionPreview";
import { useEffect, useState } from "react";
import ClozeQuestionPreview from "./components/ClozeQuestionPreview";
import ComprehensionQuestionPreview from "./components/ComprehensionQuestionPreview";
import PreviewHeader from "./components/PreviewHeader";
import { Bars } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./PreviewApp.css";

function PreviewApp({ data, headerData }) {
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		if (data.length === 0) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [data]);

	const navigate = useNavigate();
	const handleSubmitClick = (dataObj) => {
		const tokenExpiry = Cookies.get("expiryTime");
		const currentTime = new Date().getTime();
		console.log(currentTime, tokenExpiry);
		if (currentTime >= tokenExpiry) {
			toast.dismiss();
			toast.error("You need to sign-in again", {
				position: "top-right",
				autoClose: 2000,
			});
			setTimeout(() => {
				navigate("/", { replace: true });
			}, 2000);
		}

		navigate("/submit", { replace: true });
	};

	const questions = data.map((questionData, index) => {
		let questionComponent;
		switch (questionData.type) {
			case "CategorizeQuestion":
				questionComponent = (
					<CatagorizeQuestionPreview
						data={questionData}
						saveData={handleSubmitClick}
					/>
				);
				break;
			case "ClozeQuestion":
				questionComponent = (
					<ClozeQuestionPreview
						data={questionData}
						saveData={handleSubmitClick}
					/>
				);
				break;
			case "ComprehensionQuestion":
				questionComponent = (
					<ComprehensionQuestionPreview
						data={questionData}
						saveData={handleSubmitClick}
					/>
				);
				break;
		}
		return <div key={index}>{questionComponent}</div>;
	});

	return (
		<div>
			<PreviewHeader data={headerData} />
			{isLoading ? (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Bars color="#E7DECD" height="10rem" width="10rem" />
				</div>
			) : (
				<>
					{questions}
					<div className="submit">
						<div className="submitButton" onClick={handleSubmitClick}>
							Submit
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default PreviewApp;
