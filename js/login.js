// Declare variables
const form = document.querySelector('.login-form');
const inputEmail = form.elements.email;
const inputPass = form.elements.password;

const togglePass = document.querySelector('.login-form__toggle');
const togglePassIcn = document.querySelectorAll('.login-form__toggle-icon');
const hidePassBtn = togglePassIcn[0];
const showPassBtn = togglePassIcn[1];

const warningLabels = document.querySelectorAll('.login-form__warning');
const emailWarning = warningLabels[0];
const passWarning = warningLabels[1];

const warningInputStyle = {
	padding: '1rem',
	border: '1px solid #f00',
	borderRadius: '0.5rem',
	backgroundColor: '#eee',
};

// Check empty input when blur event occur
inputEmail.addEventListener('blur', (e) => {
	if (e.target.value === '' || e.target.value === null) {
		Object.assign(e.target.style, warningInputStyle);
		emailWarning.style.visibility = 'visible';
		emailWarning.innerHTML = `* Email can not empty`;
	} else {
		e.target.style = '';
		emailWarning.style = '';
	}
});
inputPass.addEventListener('blur', (e) => {
	if (e.target.value === '' || e.target.value === null) {
		Object.assign(e.target.style, warningInputStyle);
		passWarning.style.visibility = 'visible';
		passWarning.innerHTML = `* Password can not empty`;
		togglePass.style.backgroundColor = '#eee';
	} else {
		e.target.style = '';
		passWarning.style = '';
		togglePass.style = '';
	}
});

// Show/ hide password button
togglePass.addEventListener('click', () => {
	const getType = inputPass.getAttribute('type');

	if (getType === 'password') {
		inputPass.setAttribute('type', 'text');
		showPassBtn.style.display = 'block';
		hidePassBtn.style.display = 'none';
	} else {
		inputPass.setAttribute('type', 'password');
		showPassBtn.style.display = 'none';
		hidePassBtn.style.display = 'block';
	}
});

// Check login after check validation
const checkDatabase = async (email, pass) => {
	const statusLog = {
		status: false,
		id: 0,
	};
	const res = await axios.get(
		`http://localhost:3000/accounts?email=${email.value}&password=${pass.value}`
	);
	const resData = (await res.data[0]) || {};

	if (Object.keys(resData).length !== 0) {
		if (resData.email === 'admin@gmail.com' && resData.password === 'admin123')
			window.location.assign('../views/adminpage.html');
		else {
			statusLog.status = true;
			statusLog.id = resData.id;
			sessionStorage.setItem('statusLog', JSON.stringify(statusLog));
			window.location.assign('../views/homepage.html');
		}
	} else {
		Object.assign(inputEmail.style, warningInputStyle);
		Object.assign(inputPass.style, warningInputStyle);
		emailWarning.style.visibility = 'visible';
		passWarning.style.visibility = 'visible';
		togglePass.style.backgroundColor = '#eee';
		emailWarning.innerHTML = '* Wrong email or password';
		passWarning.innerHTML = '* Wrong email or password';
	}
};

// Submit form
form.addEventListener('submit', (e) => {
	e.preventDefault();

	let flagMail = (flagPass = false);
	const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	Object.assign(inputEmail.style, warningInputStyle);
	Object.assign(inputPass.style, warningInputStyle);
	emailWarning.style.visibility = 'visible';
	passWarning.style.visibility = 'visible';
	togglePass.style.backgroundColor = '#eee';

	// Validation email
	if (inputEmail.value === '' || inputEmail.value === null)
		emailWarning.innerHTML = `* Email can not empty`;
	else if (!validEmailRegex.test(inputEmail.value))
		emailWarning.innerHTML = `* Invalid email`;
	else {
		flagMail = true;
		inputEmail.style = '';
		emailWarning.style = '';
	}

	// Validation password
	if (inputPass.value === '' || inputPass.value === null)
		passWarning.innerHTML = `* Password can not empty`;
	else if (inputPass.value.length < 8)
		passWarning.innerHTML = `* Password must be at least 8 character`;
	else {
		flagPass = true;
		inputPass.style = '';
		passWarning.style = '';
		togglePass.style = '';
	}

	if (flagMail && flagPass) checkDatabase(inputEmail, inputPass);
});
