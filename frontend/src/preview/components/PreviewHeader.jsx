function PreviewHeader({ data }) {
	return (
		<div
			className="previewHeader"
			style={{
				backgroundImage: data && data.image ? `url(${data.image})` : "none",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "cover",
			}}
		>
			{data ? data.formName : "Untitled Form"}
		</div>
	);
}

export default PreviewHeader;
