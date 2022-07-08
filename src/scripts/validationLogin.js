const formElement = document.forms[0];
const form = document.querySelector('.login');

const inputEmail = formElement.elements.email;
const inputPassword = formElement.elements.password;
const changeTypePasswordButton = document.querySelector('.login-form__toggle');
const showPasswordIcon = document.getElementById('show-password');
const hidePasswordIcon = document.getElementById('hide-password');
const warningEmail = document.getElementById('email-warning');
const warningPassword = document.getElementById('password-warning');

const warningInputStyle = {
  padding: '1rem',
  border: '1px solid #f00',
  borderRadius: '0.5rem',
  backgroundColor: '#eee',
};

const blurWarningEvent = (e) => {
  const warningAnnounce = e.target.nextElementSibling.nextElementSibling;
  if (e.target.value === '' || e.target.value === null) {
    Object.assign(e.target.style, warningInputStyle);
    warningAnnounce.style.visibility = 'visible';
    warningAnnounce.innerHTML = `* ${e.target.name} can not be empty`;
    changeTypePasswordButton.style.backgroundColor = '#eee';
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
    hidePasswordIcon.style.display = 'block';
  }
});

const checkDatabase = (email, password) => {
  axios
    .get(`http://localhost:3000/account`)
    .then((res) => res.data)
    .then((receiveData) => {
      let flag = false;
      const accountInfo = {};

      for (let item of receiveData) {
        if (email.value === item.email && password.value === item.password) {
          accountInfo.id = item.id;
          accountInfo.idInfo = item.idInfo
          accountInfo.email = item.email;
          accountInfo.password = item.password;
          flag = true;
          break;
        }
      }

      if (flag) {
        alert('Congratulation');
        sessionStorage.setItem('loginInfo', JSON.stringify(accountInfo));
        window.location.assign('/src/views/homepage.html');
      } else alert('wrong email or password');
    });
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const submitElements = e.target.elements;

  const submitEmail = submitElements.email;
  const submitPassword = submitElements.password;
  let flagEmail = (flagPassword = false);
  const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  Object.assign(submitEmail.style, warningInputStyle);
  warningEmail.style.visibility = 'visible';
  Object.assign(submitPassword.style, warningInputStyle);
  warningPassword.style.visibility = 'visible';
  changeTypePasswordButton.style.backgroundColor = '#eee';

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
  else if (submitPassword.value.length < 8)
    warningPassword.innerHTML = `* Password must be at least 8 character`;
  else {
    flagPassword = true;
    submitPassword.style = '';
    warningPassword.style.visibility = 'hidden';
    changeTypePasswordButton.style = '';
  }

  if (flagEmail && flagPassword) checkDatabase(submitEmail, submitPassword);
});
