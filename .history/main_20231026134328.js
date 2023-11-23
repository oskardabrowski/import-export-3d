const submitForm = document.addEventListener("submit", (e) => {
	e.preventDefault();
	const input = document.querySelector("#inputObjFile");
	const reader = new FileReader();
	reader.addEventListener("load", (e) => {});
	reader.readAsDataURL(selectedFile);
});
