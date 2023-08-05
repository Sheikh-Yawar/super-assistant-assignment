import { toast } from "react-toastify";
import "../styles/QuestionBox.css";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function QuestionBox({ index, saveComprehensionQuestionData, questionData }) {
	const [questionText, setQuestionText] = useState(
		questionData ? questionData.question : ""
	);
	const [options, setOptions] = useState(
		questionData ? questionData.options : [""]
	);

	const handleOptionChange = (index, e) => {
		const updatedOptions = [...options];
		updatedOptions[index] = e.target.value;
		setOptions(updatedOptions);
	};

	const handleAddOptionInput = () => {
		const lastOption = options[options.length - 1];
		if (lastOption.trim() !== "") {
			setOptions([...options, ""]);
		} else {
			toast.warning("Previous Option input is empty !!", {
				position: "top-right",
				autoClose: 3000,
			});
		}
	};

	const handleQuestionText = (e) => {
		setQuestionText(e.target.value);
	};

	return (
		<div>
			<div className="questions" key={index}>
				<div className="questionBox">
					<div>Question {index}</div>
					<input
						value={questionText}
						placeholder="Add question here"
						onChange={handleQuestionText}
					/>
				</div>
				<div className="options">
					{options.map((option, optionIndex) => (
						<input
							className="categoryInput"
							type="text"
							key={optionIndex}
							value={option}
							placeholder="Enter Option"
							onChange={(e) => handleOptionChange(optionIndex, e)}
						/>
					))}
				</div>
				<div className="save">
					<div
						style={{
							color: "#0A122A",
							fontSize: "3rem",
							fontWeight: "bolder",
							cursor: "pointer",
						}}
						onClick={handleAddOptionInput}
						title="Add another option"
					>
						+
					</div>
					<button
						onClick={() => saveComprehensionQuestionData(questionText, options)}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}

export default QuestionBox;
