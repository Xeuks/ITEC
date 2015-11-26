function validateForm(form)
{
	var isValidationOk = true;
	var elements = form.elements;

	for (var i = 0; i < elements.length; i++) {
		errorElem = document.getElementById(elements[i].name + "FieldError");
		
		var isError = elements[i].type === "text" && elements[i].value === "";
		
		if(errorElem != null)
		{
			errorElem.style.display =  isError ? "block" : "none";
		}

		isValidationOk &= !isError;
		
	}
	
	return isValidationOk;
}

function validateAndSubmitForm(form)
{
	if(validateForm(form))
	{
		$.cookie("name", form.elements[0].value);
		loadSite('ProcessLogin');
	}
	
	return false;
}