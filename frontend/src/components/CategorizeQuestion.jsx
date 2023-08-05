import { BsFillImageFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/CategorizeQuestion.css";
import useImageUpload from "../customHooks/useImageUpload";

function CatagorizeQuestion({
	uniqueIdentifier,
	index,
	deleteQuestion,
	saveData,
	data,
}) {
	const {
		showDeleteIcon,
		imageURL,
		imageFile,
		handleImageChange,
		deleteImage,
	} = useImageUpload(data);

	const [dropdownSelectedValues, setDropDownSelectedValues] = useState(
		data.dropdownSelectedValues ? data.dropdownSelectedValues : []
	);
	const [description, setDescription] = useState(
		data.description ? data.description : ""
	);
	const [categories, setCategories] = useState(
		data.categories ? data.categories : [""]
	);
	const [options, setOptions] = useState(data.options ? data.options : [""]);

	const handleAddDescription = (e) => {
		setDescription(e.target.value);
	};

	const handleCategoryChange = (index, e) => {
		const updatedCategories = [...categories];
		updatedCategories[index] = e.target.value;
		setCategories(updatedCategories);
	};

	const handleAddCategoryInput = () => {
		const lastCategory = categories[categories.length - 1];
		if (lastCategory.trim() !== "") {
			setCategories([...categories, ""]);
		} else {
			toast.error("Previous Category input is empty !!", {
				position: "top-right",
				autoClose: 3000,
			});
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
			toast.error("Previous Option input is empty !!", {
				position: "top-right",
				autoClose: 3000,
			});
		}
	};

	const handleDropdownChange = (index, e) => {
		const selectedValue = e.target.value;
		if (index < dropdownSelectedValues.length) {
			const updatedValues = [...dropdownSelectedValues];
			updatedValues[index] = selectedValue;
			setDropDownSelectedValues(updatedValues);
		} else {
			setDropDownSelectedValues([...dropdownSelectedValues, selectedValue]);
		}
	};

	const validateList = (arr) => {
		let hasValues = false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].length > 0) {
				hasValues = true;
				return hasValues;
			}
		}

		return false;
	};

	const handleQuestionData = () => {
		if (
			description.trim() === "" ||
			!validateList(categories) ||
			!validateList(options) ||
			dropdownSelectedValues.length === 0
		) {
			toast.error("Please fill all the details to save.", {
				position: "top-right",
				autoClose: 3000,
			});
		} else {
			saveData({
				type: "CategorizeQuestion",
				id: index,
				image: imageFile,
				description: description,
				categories: categories,
				options: options,
				dropdownSelectedValues: dropdownSelectedValues,
			});
		}
	};

	return (
		<div className="QuestionContainer">
			<div className="CategorizeQuestionTextPart">
				<div
					style={{
						fontSize: "2rem",
						marginBottom: "2rem",
						fontWeight: "bold",
					}}
				>
					Question {index}
				</div>
				<div className="CategorizeQuestiontextAndImage">
					<textarea
						type="text"
						className="CategorizeQuestiontext"
						value={description}
						onChange={handleAddDescription}
						placeholder="Description"
					/>
					<div>
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
				</div>
				<div className="CategoriesContainer">
					<div className="CategorizeQuestionHeadings">Categories</div>
					<div>
						<div className="categories">
							{categories.map((category, index) => (
								<input
									className="categoryInput"
									key={index}
									type="text"
									value={category}
									onChange={(e) => handleCategoryChange(index, e)}
									placeholder="Enter Category"
								/>
							))}
						</div>
						<div
							style={{
								color: "#0A122A",
								fontSize: "3rem",
								fontWeight: "bolder",
								cursor: "pointer",
							}}
							onClick={handleAddCategoryInput}
							title="Add another category"
						>
							+
						</div>
					</div>
				</div>
				<div className="itemsAndBelongstoContianer">
					<div className="itemsAndBelongstoContainerHeading">
						<p className="CategorizeQuestionHeadings">Options</p>
						<p className="CategorizeQuestionHeadings">Belongs To</p>
					</div>
					<div>
						{options.map((option, index) => (
							<div className="itemsAndBelongsto" key={index}>
								<input
									className="categoryInput"
									type="text"
									value={option}
									placeholder="Enter Option"
									onChange={(e) => handleOptionChange(index, e)}
								/>
								<select
									value={dropdownSelectedValues[index]}
									onChange={(e) => handleDropdownChange(index, e)}
									className="CategorizeQuestionDropdown"
								>
									<option>
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									</option>
									{categories.map((category, index) => (
										<option key={index} value={index}>
											{category}
										</option>
									))}
								</select>
							</div>
						))}
					</div>
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
			<div className="CategorizeQuestionImagePart">
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

export default CatagorizeQuestion;
