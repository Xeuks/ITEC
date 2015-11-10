function validateForm(form)
{
	var elements = form.elements;

	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type === "text" && elements[i].value === "")
		{
			errorElem = document.getElementById(elements[i].name + "FieldError");
			
			if(errorElem != null)
			{
				errorElem.style.display = "block";
			}
		}
	}
	
	return false;
}