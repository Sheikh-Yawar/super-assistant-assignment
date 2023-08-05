import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiFillDelete } from "react-icons/ai";
import { BsFillImageFill } from "react-icons/bs";
import { CgAdd } from "react-icons/cg";
import useImageUpload from "../customHooks/useImageUpload";
import QuestionBox from "./QuestionBox";

import "react-toastify/dist/ReactToastify.css";
import "../styles/ComprehensionQuestion.css";

function ComprehensionQuestion({
	index,
	deleteQuestion,
	uniqueIdentifier,
	saveData,
	data,
}) {
	const generateInitialCards = (numAdds) => {
		if (numAdds && numAdds > 0) {
			return Array.from({ length: numAdds }, () => "add");
		} else {
			return ["add"];
		}
	};

	const {
		showDeleteIcon,
		imageURL,
		imageFile,
		handleImageChange,
		deleteImage,
	} = useImageUpload(data);
	const [passage, setPassage] = useState(data.passage ? data.passage : "");
	const [questionCards, setQuestionCards] = useState(
		generateInitialCards(data.questions ? data.questions.length : 0)
	);
	const [questions, setQuestions] = useState(
		data.questions ? data.questions : []
	);
	const [questionText, setQuestionText] = useState("");
	const [options, setOptions] = useState([]);

	const validateList = (arr) => {
		let hasValues = false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].length !== 0) {
				hasValues = true;
				return hasValues;
			}
		}

		return false;
	};

	const saveQuestionData = (text, opts) => {
		if (text === "" || !validateList(opts)) {
			toast.warning("Please fill all the question details.", {
				position: "top-right",
				autoClose: 3000,
			});
		} else {
			toast.success("Saved, you can now add another question.", {
				position: "top-right",
				autoClose: 3000,
			});
			setQuestionText(text);
			setOptions([...opts]);
			setQuestions([...questions, { question: text, options: opts }]);
		}
	};

	const addAnotherQuestion = () => {
		if (questionText.length === 0 || options.length === 0) {
			toast.warning(
				"Please fill  all the details or Save the previous question first.",
				{
					position: "top-right",
					autoClose: 3000,
				}
			);
		} else {
			setQuestionText("");
			setOptions([]);
			setQuestionCards([...questionCards, "add"]);
		}
	};

	const handlePassageChange = (e) => {
		setPassage(e.target.value);
	};

	const handleQuestionData = () => {
		if (questions.length === 0 || passage.length === 0) {
			toast.error(
				"Please fill  all the details or Save the previous question first.",
				{
					position: "top-right",
					autoClose: 3000,
				}
			);
		} else {
			saveData({
				type: "ComprehensionQuestion",
				id: index,
				passage: passage,
				questions: questions,
				image: imageFile,
			});
		}
	};
	return (
		<div className="QuestionContainer">
			<div>
				<div className="comprehensionQuestion">
					<div
						style={{
							fontSize: "2rem",
							marginBottom: "2rem",
							fontWeight: "bold",
						}}
					>
						Question {index}
					</div>
					<div className="comprehensionQuestionText">
						<textarea
							placeholder="Type Passage here"
							value={passage}
							onChange={handlePassageChange}
						/>
						{showDeleteIcon ? (
							<AiFillDelete
								title="Delete Image"
								onClick={deleteImage}
								className="deleteIcon"
							/>
						) : (
							<label htmlFor={uniqueIdentifier}>
								<BsFillImageFill
									title="Add image(Optional)"
									className="CategorizeQuestionImage"
								/>

								<input
									type="file"
									id={uniqueIdentifier}
									style={{ display: "none" }}
									onChange={handleImageChange}
								/>
							</label>
						)}
					</div>
					{questionCards.map((value, idx) => (
						<React.Fragment key={idx}>
							<QuestionBox
								index={`${index}.${idx + 1}`}
								saveComprehensionQuestionData={saveQuestionData}
								questionData={questions[idx]}
							/>
						</React.Fragment>
					))}
				</div>
				<div
					className="addQuestion"
					title="Add another Question"
					onClick={() => addAnotherQuestion()}
				>
					<CgAdd />
				</div>
			</div>
			<div>
				{showDeleteIcon ? (
					<div
						style={{
							backgroundColor: "#0A1224",
							width: "400px",
							height: "250px",
							borderRadius: "1rem",
						}}
					>
						<img
							style={{
								width: "100%",
								height: "100%",
								borderRadius: "1rem",
							}}
							src={data.image ? data.image : imageURL}
						/>
					</div>
				) : null}
			</div>
			<div className="saveAndDelete">
				<button className="saveQuestion" onClick={handleQuestionData}>
					Save
				</button>
				<AiFillDelete
					title="Delete Question"
					className="deleteQuestion"
					onClick={() => deleteQuestion(index)}
				/>
			</div>
		</div>
	);
}

export default ComprehensionQuestion;
