// Declare variables
const infoEmail = document.getElementById('info-email');
const infoPass = document.getElementById('info-pass');
const infoName = document.getElementById('info-name');
const infoAge = document.getElementById('info-age');

const togglePassBtn = document.querySelector('.homepage-info__btn');
const logoutBtn = document.querySelector('.homepage__logout');

const tableData = document.querySelector('.homepage-show__table');
const tableBodyData = tableData.children[1];

// Load data
const firstLoadData = async () => {
	let userAccounts = [];
	let userInfos = [];
	const userData = [];

	const resAcc = await axios.get(`http://localhost:3000/accounts`);
	const resAccData = await resAcc.data;
	const resInfo = await axios.get(`http://localhost:3000/infos`);
	const resInfoData = await resInfo.data;

	userAccounts = resAccData.slice(1);
	userInfos = resInfoData.slice(1);

	for (let itemAcc of userAccounts) {
		for (let itemInfo of userInfos) {
			if (itemInfo.accountId === itemAcc.id) {
				userData.push({
					idAcc: itemAcc.id,
					idInfo: itemInfo.id,
					email: itemAcc.email,
					pass: itemAcc.password,
					name: itemInfo.name,
					age: itemInfo.age,
					createdDate: itemAcc.createdAt,
				});
			}
		}
	}

	let adminInfo = {
		email: resAccData[0].email,
		pass: resAccData[0].password,
		name: resInfoData[0].name,
		age: resInfoData[0].age,
	};

	infoEmail.innerHTML = adminInfo.email;
	infoPass.value = adminInfo.pass;
	infoName.innerHTML = adminInfo.name;
	infoAge.innerHTML = adminInfo.age;

	let strUserData = '';
	let acountItemData = 1;
	for (let item of userData) {
		strUserData += `
      <tr>
        <td>${acountItemData++}</td>
        <td>${item.name}</td>
        <td>${item.age}</td>
        <td>${item.email}</td>
        <td>${item.pass}</td>
        <td>${item.createdDate}</td>
        <td><button class="homepage-show__del" 
          data-idacc=${item.idAcc}
          data-idinfo=${item.idInfo}>Delete</button>
        </td>
      </tr>
    `;
	}
	tableBodyData.innerHTML = strUserData;

	const delBtns = document.querySelectorAll('.homepage-show__del');
	for (let item of delBtns) {
		item.onclick = (e) => {
			const res = confirm('Are you sure want to delete this account?');

			if (res) {
				try {
					axios.delete(
						`http://localhost:3000/accounts/${e.target.dataset.idacc}`
					);
					axios.delete(
						`http://localhost:3000/infos/${e.target.dataset.idinfo}`
					);
					alert('Successful!!!');
				} catch (e) {
					alert('Error!!!');
					console.log(e);
				}
			}
		};
	}
};
firstLoadData();

// Toggle show/ hide admin password
togglePassBtn.addEventListener('click', (e) => {
	const typePass = infoPass.getAttribute('type');
	if (typePass === 'password') {
		infoPass.setAttribute('type', 'text');
		e.target.value = 'Hide';
	} else {
		infoPass.setAttribute('type', 'password');
		e.target.value = 'Show';
	}
});

// Logout button event
logoutBtn.addEventListener('click', () => {
	const res = confirm('Are you want to logout?');
	if (res) window.history.back();
});
