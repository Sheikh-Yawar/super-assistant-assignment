import { useState } from "react";
import { GoDotFill } from "react-icons/go";

import "../styles/PreviewQuestionBox.css";

function PreviewQuestionBox({ data, id, index, saveData }) {
	const [selectedOption, setSelectedOption] = useState("");

	const handleOptionSelect = (optionId) => {
		setSelectedOption(optionId);
		saveData(optionId, index);
	};
	return (
		<div className="questionBoxContainer">
			<div className="questionNumber">
				Question {parseInt(id) + 1}.{parseInt(index) + 1}
			</div>
			<div className="question">
				<span>
					<GoDotFill />
				</span>
				<span>{data.text}</span>
			</div>
			<div className="PreviewQuestionBoxoptions">
				{data.options.map((option, i) => (
					<label key={i} className="option">
						<input
							className="radio-button"
							type="radio"
							name={`question-${id}-${index}`}
							value={selectedOption}
							checked={selectedOption === i}
							onChange={() => handleOptionSelect(i)}
						/>
						{option}
					</label>
				))}
			</div>
		</div>
	);
}

export default PreviewQuestionBox;
