const submitForm = document.addEventListener("submit", (e) => {
	e.preventDefault();
	const input = document.querySelector("#inputObjFile");
	const reader = new FileReader();
	reader.addEventListener("load", (e) => {
		console.log(e.target.result);
	});
	reader.readAsText(input.files[0]);
});
