// Check account verify
const statusLog = JSON.parse(sessionStorage.getItem('statusLog'));
if (!statusLog?.status) window.location.assign('../index.html');

// Declare variables
let account = {
	email: '',
	pass: '',
};
let info = {
	name: '',
	age: 0,
	accountId: statusLog.id,
	createdAt: 0,
	editedAt: 0,
};
let idInfo = 0;

const infoEmail = document.getElementById('info-email');
const infoPass = document.getElementById('info-pass');
const infoName = document.getElementById('info-name');
const infoAge = document.getElementById('info-age');
const toggleInfoBtn = document.querySelector('.homepage-info__btn');

const form = document.querySelector('.homepage__form');
const inputEditItems = document.querySelectorAll('.homepage-edit__input');
const editName = inputEditItems[0];
const editAge = inputEditItems[1];
const editPass = inputEditItems[2];
const editRePass = inputEditItems[3];

const toggleShowHideBtns = document.querySelectorAll('.homepage-edit__btn');
const togglePassBtn = toggleShowHideBtns[0];
const toggleRePassBtn = toggleShowHideBtns[1];

const warningLabels = document.querySelectorAll('.homepage-edit__warning');
const nameWarning = warningLabels[0];
const ageWarning = warningLabels[1];
const passWarning = warningLabels[2];
const rePassWarning = warningLabels[3];

const logoutBtn = document.querySelector('.homepage__logout');
const delBtn = document.querySelector('.homepage__delete');

// Load data when reload
const firstLoadData = async () => {
	const resAcc = await axios
		.get(`http://localhost:3000/accounts/${statusLog.id}`)
		.catch((e) => console.log(e));
	const resAccData = await resAcc?.data;
	account.email = (await resAccData?.email) || 'Error database';
	account.pass = await resAccData?.password;

	const resInfo = await axios
		.get(`http://localhost:3000/infos?accountId=${statusLog.id}`)
		.catch((e) => console.log(e));
	const resInfoData = await resInfo?.data[0];
	info.name = await resInfoData?.name;
	info.age = await resInfoData?.age;
	info.createdAt = await resAccData?.createdAt;
	idInfo = await resInfoData?.id;

	infoEmail.innerHTML = (await account.email) || '';
	infoPass.value = (await account.pass) || '';
	infoName.innerHTML = (await resInfoData?.name) || 'No information';
	infoAge.innerHTML = (await resInfoData?.age) || 'No information';

	editName.value = (await resInfoData?.name) || '';
	editAge.value = (await resInfoData?.age) || '';
	editPass.value = await account.pass;
	editRePass.value = await account.pass;
};
firstLoadData();

// Toggle show/ hide password
toggleInfoBtn.addEventListener('click', (e) => {
	if (e.target.innerHTML === 'Show') {
		e.target.innerHTML = 'Hide';
		infoPass.setAttribute('type', 'text');
	} else {
		e.target.innerHTML = 'Show';
		infoPass.setAttribute('type', 'password');
	}
});

const togglePass = (e) => {
	const passInput =
		e.target.parentNode.previousElementSibling.firstElementChild;

	if (e.target.innerHTML === 'Show') {
		e.target.innerHTML = 'Hide';
		passInput.setAttribute('type', 'text');
	} else {
		e.target.innerHTML = 'Show';
		passInput.setAttribute('type', 'password');
	}
};
togglePassBtn.addEventListener('click', togglePass);
toggleRePassBtn.addEventListener('click', togglePass);

// Check empty input when blur event occur
const emptyWarning = (e) => {
	const warningTxt = e.target.nextElementSibling;
	const warningStyle = {
		border: '1px solid #f00',
		backgroundColor: '#eee',
	};
	warningTxt.style.visibility = 'visible';
	Object.assign(e.target.style, warningStyle);

	if (e.target.value === '') {
		warningTxt.innerHTML = 'Can not empty';
	} else {
		e.target.style = '';
		warningTxt.style = '';
	}
};

editName.addEventListener('blur', emptyWarning);
editAge.addEventListener('blur', emptyWarning);
editPass.addEventListener('blur', emptyWarning);
editRePass.addEventListener('blur', emptyWarning);

// Logout account
logoutBtn.addEventListener('click', () => {
	const res = confirm('Are you want to logout?');
	if (res) {
		sessionStorage.removeItem('statusLog');
		window.history.back();
	}
});

// Delete account and it information
delBtn.addEventListener('click', () => {
	const res = confirm('Are you sure?, this will be delete your account!!!');
	if (res) {
		if (idInfo !== 0)
			axios.delete(`http://localhost:3000/infos?accountId=${idInfo}`);
		axios.delete(`http://localhost:3000/accounts/${statusLog.id}`);

		sessionStorage.removeItem('statusLog');
		window.history.back();
	}
});

// Submit form
form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const containNumRegex = /(?=.*[0-9])/;
	const checkPassRegex =
		/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
	let flagName = (flagAge = flagPass = flagRePass = false);

	const warningStyle = {
		border: '1px solid #f00',
		backgroundColor: '#eee',
	};

	// Default warning
	Object.assign(editName.style, warningStyle);
	Object.assign(editAge.style, warningStyle);
	Object.assign(editPass.style, warningStyle);
	Object.assign(editRePass.style, warningStyle);
	nameWarning.style.visibility = 'visible';
	ageWarning.style.visibility = 'visible';
	passWarning.style.visibility = 'visible';
	rePassWarning.style.visibility = 'visible';

	// Check name validation
	if (editName.value === '') nameWarning.innerHTML = `* Can not empty`;
	else if (containNumRegex.test(editName.value))
		nameWarning.innerHTML = `* Can not have number in name`;
	else {
		flagName = true;
		nameWarning.style = '';
		editName.style = '';
	}

	// Check age validation
	if (editAge.value === '') ageWarning.innerHTML = '* Can not empty';
	else if (!containNumRegex.test(editAge.value))
		ageWarning.innerHTML = '* Only have number';
	else if (editAge.value <= 0 || editAge.value >= 100)
		ageWarning.innerHTML = '* Age only between 1 to 100';
	else {
		flagAge = true;
		ageWarning.style = '';
		editAge.style = '';
	}

	// Check password validation
	if (editPass.value === '') passWarning.innerHTML = '* Can not empty';
	else if (!checkPassRegex.test(editPass.value))
		passWarning.innerHTML = '* Invalid password';
	else {
		flagPass = true;
		passWarning.style = '';
		editPass.style = '';
	}

	// Check re-password validation
	if (editRePass.value === '') rePassWarning.innerHTML = '* Can not empty';
	else if (editRePass.value !== editPass.value)
		rePassWarning.innerHTML = '* Password does not match';
	else {
		flagRePass = true;
		rePassWarning.style = '';
		editRePass.style = '';
	}

	// Upload data
	if (flagName && flagAge && flagPass && flagRePass) {
		// Upload/ Edit information
		if (!idInfo) {
			info.name = editName.value;
			info.age = editAge.value;
			info.createdAt = Date.now();
			info.editedAt = Date.now();

			axios
				.post(`http://localhost:3000/infos`, info)
				.then(() => alert('Successful added!!!'))
				.catch((e) => {
					alert('Fail added!!!');
					console.log(e);
				});
		} else if (editName.value !== info.name || editAge.value !== info.age) {
			info.name = editName.value;
			info.age = editAge.value;
			info.editedAt = Date.now();

			axios
				.put(`http://localhost:3000/infos/${idInfo}`, info)
				.then(() => alert('Successful changed!!!'))
				.catch((e) => {
					alert('Fail changed!!!');
					console.log(e);
				});
		}

		// Upload new password
		if (editPass.value !== account.pass && editPass.value === editRePass.value)
			axios
				.put(`http://localhost:3000/accounts/${statusLog.id}`, {
					...account,
					password: editPass.value,
				})
				.then(() => alert('Success changed password!!!'))
				.catch((e) => {
					alert('Fail changed password');
					console.log(e);
				});
	}
});
