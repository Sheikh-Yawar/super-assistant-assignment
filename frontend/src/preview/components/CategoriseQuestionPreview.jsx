import { useState } from "react";
import { Droppable, Draggable } from "react-drag-and-drop";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoDotFill } from "react-icons/go";
import { GrPowerReset } from "react-icons/gr";
import "../styles/CatagorizeQuestionPreview.css";

function CatagorizeQuestionPreview({ data, saveData }) {
	const [options, setOptions] = useState(data.options);
	const [categoryOptions, setCategoryOptions] = useState(
		data.categories.map(() => [])
	);

	const handleDrop = (optionIndex, categoryIndex) => {
		const updatedOptions = [...options];
		const option = updatedOptions.splice(optionIndex, 1)[0];
		const updatedCategoryOptions = [...categoryOptions];
		updatedCategoryOptions[categoryIndex].push(option);

		setOptions(updatedOptions);
		setCategoryOptions(updatedCategoryOptions);
	};

	const handleResetClick = () => {
		setOptions(data.options);
		setCategoryOptions(data.categories.map(() => []));
	};

	const validateList = (arr) => {
		for (let i = 0; i < categoryOptions.length; i++) {
			if (arr[i].length > 0) {
				return true;
			}
		}
		return false;
	};

	const handleSaveClick = () => {
		if (
			options.length == data.options.length ||
			!validateList(categoryOptions)
		) {
			toast.warning("Please answer the question before submitting.", {
				position: "top-right",
				autoClose: 3000,
			});
		} else {
			let answers = [];
			for (let i = 0; i < data.categories.length; i++) {
				const keyName = data.categories[i];
				answers.push({ [keyName]: categoryOptions[i] });
			}

			saveData(answers);
		}
	};

	return (
		<div className="previewContainer">
			<div className="categoriseQuestionPreview">
				<div className="questionNumber">Question {parseInt(data.id) + 1}</div>
				<div className="question">
					<span>
						<GoDotFill />
					</span>
					<span>{data.description}</span>
				</div>
				<div className="options">
					{options.map((option, i) => (
						<Draggable key={i} type="option" data={i}>
							<div className="option">{option}</div>
						</Draggable>
					))}
				</div>

				<div className="categories">
					{data.categories.map((category, i) => (
						<div key={i}>
							<div className="category"> {category}</div>
							<Droppable
								types={["option"]}
								onDrop={(data) => handleDrop(data.option[0], i)}
							>
								<div className="box">
									{categoryOptions[i].map((option, j) => (
										<div key={j} className="option">
											{option}
										</div>
									))}
								</div>
							</Droppable>
						</div>
					))}
				</div>
			</div>
			{data && data.image ? (
				<div className="questionImage">
					<img src={data && data.image ? data.image : ""} />
				</div>
			) : null}
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

export default CatagorizeQuestionPreview;
