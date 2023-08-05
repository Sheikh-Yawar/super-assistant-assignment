import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/Cloze.css";
import "react-toastify/dist/ReactToastify.css";
import { AiFillDelete } from "react-icons/ai";

function ClozeQuestion({ index, deleteQuestion, saveData, data }) {
	const [sentence, setAddSentence] = useState(
		data.sentence ? data.sentence : ""
	);
	const [options, setOptions] = useState(data.options ? data.options : [""]);
	const [correctOptions, setCorrectOptions] = useState([]);

	const handleAddSentence = (e) => {
		setAddSentence(e.target.value);
	};

	const getSelectionText = () => {
		const inputElement = document.getElementById("ClozeQuestionsentence");
		let selectedText = "";
		if (window.getSelection) {
			selectedText = window.getSelection().toString().trim();
			const startIndex = inputElement.selectionStart;
			const endIndex = inputElement.selectionEnd;

			// Create a string with dashes of the same length as the selected text
			const dashes = "-".repeat(selectedText.length);

			// Create a new sentence with the selected text replaced by dashes
			const newSentence =
				sentence.substring(0, startIndex) +
				dashes +
				sentence.substring(endIndex);

			// Update the state variable with the new sentence
			setAddSentence(newSentence);
		}

		if (selectedText.length > 0) {
			const updatedOptions = [selectedText, ...options];
			setCorrectOptions([...correctOptions, selectedText]);
			setOptions(updatedOptions);
		}
	};

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

	const validateList = (arr) => {
		let hasValues = false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].length === 0) {
				hasValues = false;
				return hasValues;
			}
		}

		return true;
	};

	const handleQuestionData = () => {
		if (
			sentence.trim() === "" ||
			!validateList(options) ||
			correctOptions.length === 0
		) {
			toast.error("Please fill all the details to save.", {
				position: "top-right",
				autoClose: 3000,
			});
		} else {
			toast.success("Saved, you can now preview it", {
				position: "top-right",
				autoClose: 3000,
			});
			saveData({
				type: "ClozeQuestion",
				id: index,
				sentence: sentence,
				options: options,
				correctOptions: correctOptions,
			});
		}
	};
	return (
		<div className="QuestionContainer">
			<div className="clozeQuestiontext">
				<div
					style={{
						fontSize: "2rem",
						marginBottom: "2rem",
						fontWeight: "bold",
					}}
				>
					Question {index}
				</div>
				<div className="clozeQuestionInput">
					<label htmlFor="ClozeQuestionsentence" style={{ fontSize: "1.5rem" }}>
						Add Sentence
					</label>
					<textarea
						id="ClozeQuestionsentence"
						type="text"
						className="ClozeQuestionsentence"
						value={sentence}
						onMouseUp={getSelectionText}
						onChange={handleAddSentence}
						placeholder="Highlight the words that you want to convert into blanks"
					/>
				</div>
				<div className="clozeQuestionOptions">
					{options.map((option, index) => (
						<input
							className="categoryInput"
							type="text"
							key={index}
							value={option}
							placeholder="Enter Option"
							onChange={(e) => handleOptionChange(index, e)}
						/>
					))}
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
				</div>
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

export default ClozeQuestion;
