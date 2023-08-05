import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GoDotFill } from "react-icons/go";
import { GrPowerReset } from "react-icons/gr";

import "../styles/ComprehensionQuestionPreview.css";
import PreviewQuestionBox from "./PreviewQuestionBox";

function ComprehensionQuestionPreview({ data }) {
	const [selectedOptionValues, setSelectedOptionValues] = useState([]);

	const getData = (optionNum, index) => {
		if (selectedOptionValues[index] !== undefined) {
			const updatedOptionValues = [...selectedOptionValues];
			updatedOptionValues[index] = optionNum;
			setSelectedOptionValues(updatedOptionValues);
		} else {
			setSelectedOptionValues([...selectedOptionValues, optionNum]);
		}
	};
	const handleSaveClick = () => {
		if (selectedOptionValues < data.questions.length) {
			toast.warning("Please answer all the questions before submitting.", {
				position: "top-right",
				autoClose: 3000,
			});
		} else {
			console.log(selectedOptionValues);
		}
	};
	return (
		<div className="previewContainer">
			<div className="comprehensionQuestionPreview">
				<div className="questionNumber">Question {data.id}</div>
				<div className="question">
					<span>
						<GoDotFill />
					</span>
					<span>{data.passage}</span>
				</div>
				{data.questions.map((question, i) => (
					<div key={i}>
						<PreviewQuestionBox
							data={question}
							id={data.id}
							index={i}
							saveData={getData}
						/>
					</div>
				))}
			</div>
			<div className="questionImage">
				<img src="https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80" />
			</div>
			<div className="saveAndReset">
				<button
					className="previewSave"
					title="Save Answers"
					onClick={handleSaveClick}
				>
					Submit
				</button>
			</div>
		</div>
	);
}

export default ComprehensionQuestionPreview;
