function validateFindForm(e){

   // Fetching values from input fields
    let form = document.forms["findForm"];

    let petType = document.querySelector('#petOptions');
    let pet = petType.options[petType.selectedIndex].value;

    let age = form["age"].value;

    let genderType = document.querySelector('#genderOptions');
    let gender = genderType.options[genderType.selectedIndex].value;

    let breed = form["breed"].value;

   // Checking if any of the required fields are empty
   if ( breed == ''|| pet == '' || gender == '' || age == '') {
       // Displaying error message
       alert('Please fill in all required fields.');
       e.preventDefault();
       return false; // Prevents form submission
   }

   // Form is valid, allow submission
   return true;

}


function validateGiveForm(e){


   // Fetching values from input fields
   let form = document.forms["giveForm"];

   let petType = document.querySelector('#petOptions');
   let pet = petType.options[petType.selectedIndex].value;

   let age = form["age"].value;

   let genderType = document.querySelector('#genderOptions');
   let gender = genderType.options[genderType.selectedIndex].value;

   let breed = form["breed"].value;
   let name = form["name"].value;
   let email = form["email"].value;
   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


   let comment = document.getElementById("comments").value;

  // Checking if any of the required fields are empty
  if ( breed == ''|| pet == '' || gender == '' || age == '' || email == '' || name == '' || comment == '' ) {
      // Displaying error message
      alert('Please fill in all required fields.');
      e.preventDefault();
      return false; // Prevents form submission
    } else if (!email.match(emailRegex)){
    alert('Please enter a valid email format.');
    e.preventDefault();
    return false; // Prevents form submission
    } else {
         // Form is valid, allow submission
    return true;
    }

}

//client side verification 
function validateCreateForm(e){
    let form = document.forms["createForm"];
    let username = form["username"].value;
    let password = form["password"].value;

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    if (!usernameRegex.test(username)) {
        alert('Invalid username format. A username can contain letters (both upper and lowercase) and digits only.');
        return false;
    }

    if (!passwordRegex.test(password)) {
        alert('Invalid password format. A password must be at least 4 characters long, have at least one letter, and at least one digit.');
        return false;
    }
    return true;

}

//client side verification 
function validateLoginForm(e){
    let form = document.forms["loginForm"];
    let username = form["username"].value;
    let password = form["password"].value;

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    if (!usernameRegex.test(username)) {
        alert('Invalid username format. A username can contain letters (both upper and lowercase) and digits only.');
        return false;
    }

    if (!passwordRegex.test(password)) {
        alert('Invalid password format. A password must be at least 4 characters long, have at least one letter, and at least one digit.');
        return false;
    }
    return true;

}