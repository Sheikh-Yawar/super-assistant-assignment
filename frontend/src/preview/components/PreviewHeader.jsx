function PreviewHeader({ data }) {
	return (
		<div
			className="previewHeader"
			style={{
				backgroundImage:
					data.length > 0 && data[0].image ? `url(${data.image})` : "none",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "cover",
			}}
		>
			{data.length > 0 ? data[0].formName : "Untitled Form"}
		</div>
	);
}

export default PreviewHeader;
