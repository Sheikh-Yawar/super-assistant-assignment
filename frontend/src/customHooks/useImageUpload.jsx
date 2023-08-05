import { useState } from "react";

const useImageUpload = (data) => {
	const [showDeleteIcon, setShowDeleteIcon] = useState(
		data && data.image ? true : false
	);
	const [imageURL, setImageURL] = useState(
		data && data.image ? data.image : ""
	);
	const [imageFile, setImageFile] = useState(null);

	const handleImageChange = async (e) => {
		const tempImageFile = e.target.files[0];
		setShowDeleteIcon(true);
		setImageFile(tempImageFile);
		const imageUrl = URL.createObjectURL(tempImageFile);
		setImageURL(imageUrl);
	};

	const deleteImage = () => {
		setImageURL("");
		setShowDeleteIcon(false);
		setImageFile(null);
	};

	return {
		showDeleteIcon,
		imageURL,
		imageFile,
		handleImageChange,
		deleteImage,
	};
};

export default useImageUpload;
