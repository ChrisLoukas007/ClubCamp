(function () {
	"use strict";

	bsCustomFileInput.init(); //so any custom file inputs on the page when this line of code runs are going to be initialized with some very
	//basic JS functionality

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll(".validated-form");

	// Loop over them and prevent submission
	Array.from(forms).forEach(function (form) {
		form.addEventListener(
			"submit",
			function (event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add("was-validated");
			},
			false
		);
	});
})();
