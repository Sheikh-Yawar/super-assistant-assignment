import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import FormHeader from "./components/FormHeader";
import CategorizeQuestion from "./components/CategorizeQuestion";
import ClozeQuestion from "./components/clozeQuestion";
import ComprehensionQuestion from "./components/ComprehensionQuestion";
import PreviewApp from "./preview/PreviewApp";
import Authenticate from "./components/authenticate";
import ChooseAuthentication from "./components/ChooseAuthentication";
import { Bars } from "react-loader-spinner";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

function App() {
	const [questionType, setQuestionType] = useState("CategorizeQuestion");
	const [questionsData, setQuestionsData] = useState([]);
	const [headerData, setHeaderData] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			try {
				const response = await fetch("http://localhost:3000/fetch", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${Cookies.get("token")}`,
					},
				});

				if (response.status === 401) {
					throw new Error("You need to sign-in again");
				}

				if (response.status === 404) {
					throw new Error("No data found");
				}

				if (!response.ok) {
					throw new Error("Request failed");
				}

				const responseData = await response.json();
				console.log(responseData);
				setQuestionsData(responseData.data);
				setHeaderData(responseData.headerData);
			} catch (error) {
				toast.error(error.message, {
					position: "top-right",
					autoClose: 2000,
				});

				if (error.message === "You need to sign-in again") {
					setTimeout(() => {
						navigate("/", { replace: true });
					}, 2000);
				}
			} finally {
				setIsLoading(false);
			}
		}
		if (location.pathname === "/builder" || location.pathname === "/preview") {
			fetchData();
		}
	}, [location]);

	const uploadImage = async (imageFile, id) => {
		const formData = new FormData();
		formData.append("image", imageFile);
		formData.append("id", id);
		const response = await fetch("http://localhost:3000/upload-image", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error("Image upload failed");
		}

		// The server should return the URL of the uploaded image
		const responseData = await response.json();
		return responseData.imageURL;
	};

	const request = async (dataObj) => {
		try {
			const response = await fetch("http://localhost:3000/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${Cookies.get("token")}`,
				},
				body: JSON.stringify(dataObj),
			});
			if (response.status === 401) {
				throw new Error("You need to sign-in again");
			}
			if (!response.ok) {
				throw new Error("Request failed");
			}
			const responseData = await response.json();
			console.log(responseData);
		} catch (error) {
			toast.dismiss();
			toast.error(error.message, {
				position: "top-right",
				autoClose: 2000,
			});

			if (error.message === "You need to sign-in again") {
				setTimeout(() => {
					navigate("/", { replace: true });
				}, 2000);
			}
		}
	};

	const addQuestion = () => {
		setQuestionsData([
			...questionsData,
			{ type: questionType, id: questionsData.length },
		]);
	};

	const getData = async (dataObj) => {
		setIsSaving(true);
		if (dataObj.image) {
			toast.loading("Saving", {
				position: "top-right",
				autoClose: 100000,
			});

			const imageUrl = await uploadImage(dataObj.image, dataObj.id);
			dataObj.image = imageUrl;
		}

		setIsSaving(false);
		request(dataObj);

		toast.dismiss();
		toast.success("Saved", {
			position: "top-right",
			autoClose: 3000,
		});
	};

	const deleteQuestion = async (index) => {
		toast.loading("Deleting", {
			position: "top-right",
			autoClose: 100000,
		});
		try {
			const response = await fetch(`http://localhost:3000/delete/${index}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${Cookies.get("token")}`,
				},
			});

			if (response.status === 401) {
				throw new Error("You need to sign-in again");
			}

			if (!response.ok) {
				throw new Error("Request failed");
			}

			const responseData = await response.json();
			setQuestionsData(responseData.data);
			toast.dismiss();
			toast.error("Deleted", {
				position: "top-right",
				autoClose: 2000,
			});
		} catch (error) {
			toast.error(error.message, {
				position: "top-right",
				autoClose: 2000,
			});
			if (error.message === "You need to sign-in again") {
				setTimeout(() => {
					navigate("/", { replace: true });
				}, 2000);
			}
		}
	};

	const handleQuestionSelection = (e) => {
		const selectedValue = e.target.value;

		switch (selectedValue) {
			case "0":
				setQuestionType("CategorizeQuestion");
				break;
			case "1":
				setQuestionType("ClozeQuestion");
				break;
			case "2":
				setQuestionType("ComprehensionQuestion");
				break;
		}
	};

	const questions = questionsData.map((questionData, index) => {
		let questionComponent;
		switch (questionData.type) {
			case "CategorizeQuestion":
				questionComponent = (
					<CategorizeQuestion
						uniqueIdentifier={
							"imageInputCategorizeQuestion" + new Date().getTime()
						}
						data={questionData}
						index={parseInt(index) + 1}
						deleteQuestion={deleteQuestion}
						saveData={getData}
					/>
				);
				break;
			case "ClozeQuestion":
				questionComponent = (
					<ClozeQuestion
						data={questionData}
						index={parseInt(index) + 1}
						deleteQuestion={deleteQuestion}
						saveData={getData}
					/>
				);
				break;
			case "ComprehensionQuestion":
				questionComponent = (
					<ComprehensionQuestion
						uniqueIdentifier={
							"imageInputCategorizeQuestion" + new Date().getTime()
						}
						data={questionData}
						index={parseInt(index) + 1}
						deleteQuestion={deleteQuestion}
						saveData={getData}
					/>
				);
				break;
		}
		return <div key={parseInt(index) + 1}>{questionComponent}</div>;
	});

	const showData = () => {
		console.log(questionsData);
	};

	return (
		<Routes>
			<Route path="/" exact element={<ChooseAuthentication />} />
			<Route
				path="/signup"
				exact
				element={<Authenticate action={"Signup"} />}
			/>
			<Route path="/login" exact element={<Authenticate action={"Login"} />} />
			<Route
				path="/builder"
				exact
				element={
					<>
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
								<FormHeader saveData={getData} data={headerData} />
								<div className="questions-container">{questions}</div>
								<div className="form-container">
									<div className="form-message">
										Please select what type of question you want to add
									</div>
									<select
										className="form-select"
										onChange={handleQuestionSelection}
									>
										<option value="0">Categorize</option>
										<option value="1">Cloze</option>
										<option value="2">Comprehension</option>
									</select>
								</div>
								<div className="add-question-button-container">
									<button className="add-question-button" onClick={addQuestion}>
										Add Question
									</button>
									<button className="add-question-button" onClick={showData}>
										Show Question
									</button>
								</div>
							</>
						)}
					</>
				}
			/>
			<Route
				path="/preview"
				exact
				element={<PreviewApp data={questionsData} />}
			/>
		</Routes>
	);
}

export default App;
