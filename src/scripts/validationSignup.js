const formElement = document.forms[0];
const form = document.querySelector('.signup');

const inputEmail = formElement.elements.email;
const inputPassword = formElement.elements.password;
const inputRePassword = formElement.elements.repassword;
const changeTypePasswordButton = document.getElementById('password-toggle');
const changeTypeRePasswordButton = document.getElementById('re-password-toggle');
const showPasswordIcon = document.getElementById('show-password');
const hidePasswordIcon = document.getElementById('hide-password');
const showRePasswordIcon = document.getElementById('show-repassword');
const hideRePasswordIcon = document.getElementById('hide-repassword');
const warningEmail = document.getElementById('email-warning');
const warningPassword = document.getElementById('password-warning');
const warningRePassword = document.getElementById('repassword-warning');
const requiredLength = document.getElementById('required-length');
const requiredSpecial = document.getElementById('required-special');
const requiredLowercase = document.getElementById('required-lowercase');
const requiredUppercase = document.getElementById('required-uppercase');
const requiredNumeric = document.getElementById('required-numeric');

const warningInputStyle = {
  padding: '1rem',
  border: '1px solid #f00',
  borderRadius: '0.5rem',
  backgroundColor: '#eee',
};

const blurWarningEvent = (e) => {
  const warningAnnounce = e.target.nextElementSibling.nextElementSibling;
  const toggleButton = warningAnnounce.nextElementSibling;
  if (e.target.value === '' || e.target.value === null) {
    Object.assign(e.target.style, warningInputStyle);
    warningAnnounce.style.visibility = 'visible';
    warningAnnounce.innerHTML = `* ${e.target.name} can not be empty`;
    toggleButton.style.backgroundColor = '#eee';
  } else {
    e.target.style = '';
    warningAnnounce.style = 'visibility: hidden';
    changeTypePasswordButton.style = '';
  }
};
inputEmail.addEventListener('blur', blurWarningEvent);
inputPassword.addEventListener('blur', blurWarningEvent);

changeTypePasswordButton.addEventListener('click', () => {
  const typePassword = inputPassword.getAttribute('type');

  if (typePassword === 'password') {
    inputPassword.setAttribute('type', 'text');
    showPasswordIcon.style.display = 'block';
    hidePasswordIcon.style.display = 'none';
  } else {
    inputPassword.setAttribute('type', 'password');
    showPasswordIcon.style.display = 'none';
    showRePasswordIcon.style.display = 'none';
    hidePasswordIcon.style.display = 'block';
    hideRePasswordIcon.style.display = 'block';
  }
});
changeTypeRePasswordButton.addEventListener('click', () => {
  const typePassword = inputRePassword.getAttribute('type');

  if (typePassword === 'password') {
    inputRePassword.setAttribute('type', 'text');
    showRePasswordIcon.style.display = 'block';
    hideRePasswordIcon.style.display = 'none';
  } else {
    inputRePassword.setAttribute('type', 'password');
    showRePasswordIcon.style.display = 'none';
    hideRePasswordIcon.style.display = 'block';
  }
});

inputPassword.addEventListener('input', () => {
  if (/(?=.{8,})/.test(inputPassword.value)) requiredLength.style.color = 'green';
  else requiredLength.style = '';
  if (/(?=.*[!@#$%^&*])/.test(inputPassword.value)) requiredSpecial.style.color = 'green';
  else requiredSpecial.style = '';
  if (/(?=.*[!@#$%^&*])/.test(inputPassword.value)) requiredSpecial.style.color = 'green';
  else requiredSpecial.style = '';
  if (/(?=.*[a-z])/.test(inputPassword.value)) requiredLowercase.style.color = 'green';
  else requiredLowercase.style = '';
  if (/(?=.*[A-Z])/.test(inputPassword.value)) requiredUppercase.style.color = 'green';
  else requiredUppercase.style = '';
  if (/(?=.*[0-9])/.test(inputPassword.value)) requiredNumeric.style.color = 'green';
  else requiredNumeric.style = '';
});
inputRePassword.addEventListener('blur', () => {
  Object.assign(inputRePassword.style, warningInputStyle);
  warningRePassword.style.visibility = 'visible';
  warningRePassword.innerHTML = '* Password must match together';
  changeTypeRePasswordButton.style.backgroundColor = '#eee';

  if (inputRePassword.value === '' || inputRePassword.value === null)
    warningRePassword.innerHTML = `* Can not be empty`;
  else if (inputPassword.value !== inputRePassword.value)
    warningRePassword.innerHTML = '* Password must match together';
  else {
    inputRePassword.style = '';
    warningRePassword.style.visibility = 'hidden';
    changeTypeRePasswordButton.style = '';
  }
});

const checkDatabase = async (email, password) => {
  const res = await axios.get(`http://localhost:3000/currentId`);
  const resData = await res.data;
  let idIncrease = ++resData.currentAcc;
  axios.put(`http://localhost:3000/currentId`, {
    ...resData,
    currentAcc: idIncrease,
  });
  axios
    .post(`http://localhost:3000/account`, {
      id: idIncrease,
      email: email.value,
      password: password.value,
    })
    .then(() => window.history.back())
    .catch((err) => {
      console.log(err);
      alert('Failed to register');
    });
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const submitElements = e.target.elements;

  const submitEmail = submitElements.email;
  const submitPassword = submitElements.password;
  const submitRePassword = submitElements.repassword;
  let flagEmail = (flagPassword = flagRePassword = false);
  const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  Object.assign(submitEmail.style, warningInputStyle);
  warningEmail.style.visibility = 'visible';
  Object.assign(submitPassword.style, warningInputStyle);
  warningPassword.style.visibility = 'visible';
  changeTypePasswordButton.style.backgroundColor = '#eee';
  Object.assign(submitRePassword.style, warningInputStyle);
  warningRePassword.style.visibility = 'visible';
  changeTypeRePasswordButton.style.backgroundColor = '#eee';

  if (submitEmail.value === '' || submitEmail.value === null)
    warningEmail.innerHTML = `* Email can not be empty`;
  else if (!validEmailRegex.test(submitEmail.value)) warningEmail.innerHTML = `* Invalid email`;
  else {
    flagEmail = true;
    submitEmail.style = '';
    warningEmail.style.visibility = 'hidden';
  }

  if (submitPassword.value === '' || submitPassword.value === null)
    warningPassword.innerHTML = `* Password can not be empty`;
  else if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(submitPassword.value)
  )
    warningPassword.innerHTML = `* Invalid password`;
  else {
    flagPassword = true;
    submitPassword.style = '';
    warningPassword.style.visibility = 'hidden';
    changeTypePasswordButton.style = '';
  }

  if (submitRePassword.value === '' || submitRePassword.value === null)
    warningRePassword.innerHTML = `* Password can not be empty`;
  else if (submitPassword.value !== submitRePassword.value)
    warningRePassword.innerHTML = `* Password must match together`;
  else {
    flagRePassword = true;
    submitRePassword.style = '';
    warningRePassword.style.visibility = 'hidden';
    changeTypeRePasswordButton.style = '';
  }

  if (flagEmail && flagPassword && flagRePassword) checkDatabase(submitEmail, submitPassword);
});
