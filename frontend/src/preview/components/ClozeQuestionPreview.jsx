import { useState } from "react";
import { Droppable, Draggable } from "react-drag-and-drop";
import { toast } from "react-toastify";

import { GoDotFill } from "react-icons/go";
import { GrPowerReset } from "react-icons/gr";

import "react-toastify/dist/ReactToastify.css";
import "../styles/ClozeQuestionPreview.css";

function ClozeQuestionPreview({ data }) {
	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleOptionClick = (option, index) => {
		if (selectedOptions.includes(option)) {
			setSelectedOptions(selectedOptions.filter((item) => item !== option));
		} else {
			setSelectedOptions([...selectedOptions, option]);
		}
	};

	const handleResetClick = () => {
		selectedOptions([]);
	};

	const handleSaveClick = () => {
		if (selectedOptions.length === 0) {
			toast.warning("Please answer the question before submitting.", {
				position: "top-right",
				autoClose: 3000,
			});
		} else {
			console.log(selectedOptions);
		}
	};

	return (
		<div className="previewContainer">
			<div>
				<div className="questionNumber">Question {data.id}</div>
				<div className="question">
					<span>
						<GoDotFill />
					</span>
					<span>{data.sentence}</span>
				</div>
				<div className="options">
					{data.options.map((option, i) => (
						<div
							className="option"
							key={i}
							onClick={() => handleOptionClick(option, i)}
							style={{
								backgroundColor: selectedOptions.includes(option)
									? "#ffba68"
									: "transparent",
							}}
						>
							{option}
						</div>
					))}
				</div>
			</div>
			<div className="saveAndReset">
				<button
					className="previewSave"
					title="Save Answers"
					onClick={handleSaveClick}
				>
					Submit
				</button>
				<GrPowerReset
					className="reset"
					title="Reset Question"
					onClick={handleResetClick}
				/>
			</div>
		</div>
	);
}

export default ClozeQuestionPreview;
