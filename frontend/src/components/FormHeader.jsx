import { BsFillImageFill } from "react-icons/bs";
import { AiFillEye, AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/FormHeader.css";
import useImageUpload from "../customHooks/useImageUpload";

function FormHeader({ saveData, data }) {
	console.log(data.length);
	const {
		showDeleteIcon,
		imageURL,
		imageFile,
		handleImageChange,
		deleteImage,
	} = useImageUpload(data.length > 0 ? data[0] : null);
	const [formName, setformName] = useState(
		data.length > 0 ? data[0].formName : "Untitled Form"
	);

	const updateFormName = (e) => {
		setformName(e.target.value);
	};

	const handlePreviewClick = () => {
		window.open("/preview", "_blank");
	};

	const handleHeaderSave = () => {
		saveData({
			type: "formName",
			formName: formName,
			image: imageFile,
		});
	};

	return (
		<div
			style={{
				backgroundImage: imageURL ? `url(${imageURL})` : "",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "cover",
			}}
			className="formHeader"
		>
			<div>
				<input
					type="text"
					className="formName"
					value={formName}
					onChange={updateFormName}
					placeholder="Untitled Form"
				/>
				<button
					className="formHeaderButton"
					title="Save Name and Image"
					onClick={handleHeaderSave}
				>
					Save
				</button>
			</div>
			<div>
				{showDeleteIcon ? (
					<AiFillDelete
						title="Delete Image"
						onClick={deleteImage}
						className="deleteIcon"
					/>
				) : (
					<label htmlFor="imageInputFormHeader">
						<BsFillImageFill title="Add image" className="headerImage" />

						<input
							type="file"
							accept="image/*"
							id="imageInputFormHeader"
							style={{ display: "none" }}
							onChange={handleImageChange}
						/>
					</label>
				)}
				<AiFillEye
					className="formPreview"
					title="Preview form"
					onClick={handlePreviewClick}
				/>
			</div>
		</div>
	);
}

export default FormHeader;
