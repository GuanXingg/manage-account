// Declare variables
const form = document.querySelector('.signup-form');
const inputEmail = form.elements.email;
const inputPass = form.elements.password;
const inputRePass = form.elements.repassword;

const toggleVisibles = document.querySelectorAll('.signup-form__toggle');
const togglePass = toggleVisibles[0];
const toggleRePass = toggleVisibles[1];
const hidePassBtn = document.getElementById('pass-hide');
const showPassBtn = document.getElementById('pass-show');
const hideRePassBtn = document.getElementById('repass-hide');
const showRePassBtn = document.getElementById('repass-show');

const warninglabels = document.querySelectorAll('.signup-form__warning');
const emailWarning = warninglabels[0];
const passWarning = warninglabels[1];
const rePassWarning = warninglabels[2];

const ruleItems = document.getElementsByClassName('signup-form__rules-item');
const ruleLength = ruleItems[0];
const ruleSpecChar = ruleItems[1];
const ruleLowChar = ruleItems[2];
const ruleUpChar = ruleItems[3];
const ruleNum = ruleItems[4];

const warningInputStyle = {
	padding: '1rem',
	border: '1px solid #f00',
	borderRadius: '0.5rem',
	backgroundColor: '#eee',
};

// Input blur event
inputPass.addEventListener('blur', (e) => {
	if (e.target.value === '' || e.target.value === null) {
		Object.assign(e.target.style, warningInputStyle);
		passWarning.style.visibility = 'visible';
		togglePass.style.backgroundColor = '#eee';
		passWarning.innerHTML = `* Password can not empty`;
	} else {
		e.target.style = '';
		passWarning.style = '';
		togglePass.style = '';
	}
});
inputRePass.addEventListener('blur', (e) => {
	Object.assign(e.target.style, warningInputStyle);
	rePassWarning.style.visibility = 'visible';
	toggleRePass.style.backgroundColor = '#eee';

	if (e.target.value === '' || e.target.value === null)
		rePassWarning.innerHTML = `* Password can not empty`;
	else if (e.target.value !== inputPass.value)
		rePassWarning.innerHTML = `* Password does not match`;
	else {
		e.target.style = '';
		rePassWarning.style = '';
		toggleRePass.style = '';
	}
});
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

// Toggle change show/hide password
togglePass.addEventListener('click', () => {
	const inputPass = togglePass.parentNode.children[0];
	const getType = inputPass.getAttribute('type');

	if (getType === 'password') {
		inputPass.setAttribute('type', 'text');
		hidePassBtn.style.display = 'none';
		showPassBtn.style.display = 'block';
	} else {
		inputPass.setAttribute('type', 'password');
		hidePassBtn.style.display = 'block';
		showPassBtn.style.display = 'none';
	}
});
toggleRePass.addEventListener('click', () => {
	const inputPass = toggleRePass.parentNode.children[0];
	const getType = inputPass.getAttribute('type');

	if (getType === 'password') {
		inputPass.setAttribute('type', 'text');
		hideRePassBtn.style.display = 'none';
		showRePassBtn.style.display = 'block';
	} else {
		inputPass.setAttribute('type', 'password');
		hideRePassBtn.style.display = 'block';
		showRePassBtn.style.display = 'none';
	}
});

// Check password valid
inputPass.addEventListener('input', () => {
	if (/(?=.{8,})/.test(inputPass.value)) ruleLength.style.color = 'green';
	else ruleLength.style = '';

	if (/(?=.*[!@#$%^&*])/.test(inputPass.value))
		ruleSpecChar.style.color = 'green';
	else ruleSpecChar.style = '';

	if (/(?=.*[a-z])/.test(inputPass.value)) ruleLowChar.style.color = 'green';
	else ruleLowChar.style = '';

	if (/(?=.*[A-Z])/.test(inputPass.value)) ruleUpChar.style.color = 'green';
	else ruleUpChar.style = '';

	if (/(?=.*[0-9])/.test(inputPass.value)) ruleNum.style.color = 'green';
	else ruleNum.style = '';
});

const checkData = async (email) => {
	const resGet = await axios.get(
		`http://localhost:3000/accounts?email=${email.value}`
	);
	const resGetData = resGet.data;
	console.log('~ resGetData', resGetData);

	if (resGetData.length > 0) {
		Object.assign(inputEmail.style, warningInputStyle);
		emailWarning.style.visibility = 'visible';
		emailWarning.innerHTML = `* Email already exist`;
	} else {
		try {
			axios
				.post(`http://localhost:3000/accounts`, {
					email: inputEmail.value,
					password: inputPass.value,
					createdAt: Date.now(),
					editedAt: Date.now(),
				})
				.then(() => window.history.back())
				.catch((e) => {
					alert('System error!!!!');
					console.log(e);
				});
		} catch (e) {
			alert('Something wrong!!!!');
			console.log(e);
		}
	}
};

// Submit form
form.addEventListener('submit', (e) => {
	e.preventDefault();

	let flagMail = (flagPass = flagRePass = false);
	const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	Object.assign(inputEmail.style, warningInputStyle);
	Object.assign(inputPass.style, warningInputStyle);
	Object.assign(inputRePass.style, warningInputStyle);
	emailWarning.style.visibility = 'visible';
	passWarning.style.visibility = 'visible';
	rePassWarning.style.visibility = 'visible';
	togglePass.style.backgroundColor = '#eee';
	toggleRePass.style.backgroundColor = '#eee';

	// Email validation
	if (inputEmail.value === '' || inputEmail.value === null)
		emailWarning.innerHTML = `* Email can not empty`;
	else if (!validEmailRegex.test(inputEmail.value))
		emailWarning.innerHTML = `* Invalid email`;
	else {
		flagMail = true;
		inputEmail.style = '';
		emailWarning.style = '';
	}

	// Password validation
	if (inputPass.value === '' || inputPass.value === null)
		passWarning.innerHTML = `* Password can not empty`;
	else if (
		!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
			inputPass.value
		)
	)
		passWarning.innerHTML = `* Invalid password`;
	else {
		flagPass = true;
		inputPass.style = '';
		passWarning.style = '';
		togglePass.style = '';
	}

	// Re-password validation
	if (inputRePass.value === '' || inputRePass.value === null)
		rePassWarning.innerHTML = `* Password can not empty`;
	else if (inputPass.value !== inputRePass.value)
		rePassWarning.innerHTML = `* Password does not match`;
	else {
		flagRePass = true;
		inputRePass.style = '';
		rePassWarning.style = '';
		toggleRePass.style = '';
	}

	// Upload with axios after check validation
	if (flagMail && flagPass && flagRePass) checkData(inputEmail);
});
