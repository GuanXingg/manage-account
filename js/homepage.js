let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
if (typeof loginInfo === null) window.location.assign('../index.html');
else {
  let accInfo = {
    id: '',
    idAcc: '',
    name: '',
    age: '',
  };
  let currentId = {
    currentAcc: 0,
    currentInfo: 0,
  };
  let arrInfos = [];

  const infoEmail = document.getElementById('info-email');
  const infoName = document.getElementById('info-name');
  const infoAge = document.getElementById('info-age');
  const infoPass = document.getElementById('info-pass');
  const toggleInfoBtn = document.querySelector('.homepage-info__btn');

  const form = document.querySelector('.homepage__form');
  const editName = document.getElementById('edit-name');
  const editPass = document.getElementById('edit-pass');
  const editRePass = document.getElementById('edit-repass');
  const editAge = document.getElementById('edit-age');
  const togglePassBtn = document.querySelectorAll('.homepage-edit__btn')[0];
  const toggleRePassBtn = document.querySelectorAll('.homepage-edit__btn')[1];

  const logoutBtn = document.querySelector('.homepage__logout');
  const deleteAccBtn = document.querySelector('.homepage__delete');

  const showData = async () => {
    const resAcc = await axios.get(`http://localhost:3000/account/${loginInfo.id}`);
    const resDataAcc = await resAcc.data;
    loginInfo = await resDataAcc;

    const resInfo = await axios.get(`http://localhost:3000/info`);
    const resDataInfo = await resInfo.data;
    arrInfos = await resDataInfo;
    for (let item of resDataInfo) if (loginInfo.idInfo === item.idAcc) accInfo = item;

    const resCurrentId = await axios.get(`http://localhost:3000/currentId`);
    const dataCurrentId = await resCurrentId.data;
    currentId = await dataCurrentId;

    infoEmail.innerHTML = loginInfo.email || loginInfo.email;
    infoPass.value = loginInfo.password || loginInfo.password;
    infoName.innerHTML = accInfo.name || 'No information';
    infoAge.innerHTML = accInfo.age || 'No information';

    editName.value = accInfo.name || '';
    editAge.value = accInfo.age || '';
    editPass.value = loginInfo.password || loginInfo.password;
    editRePass.value = loginInfo.password || loginInfo.password;
  };
  showData();

  toggleInfoBtn.addEventListener('click', (e) => {
    if (e.target.innerHTML === 'Show') {
      e.target.innerHTML = 'Hide';
      infoPass.setAttribute('type', 'text');
    } else {
      e.target.innerHTML = 'Show';
      infoPass.setAttribute('type', 'password');
    }
  });

  togglePassBtn.addEventListener('click', (e) => {
    if (e.target.innerHTML === 'Show') {
      e.target.innerHTML = 'Hide';
      editPass.setAttribute('type', 'text');
    } else {
      e.target.innerHTML = 'Show';
      editPass.setAttribute('type', 'password');
    }
  });
  toggleRePassBtn.addEventListener('click', (e) => {
    if (e.target.innerHTML === 'Show') {
      e.target.innerHTML = 'Hide';
      editRePass.setAttribute('type', 'text');
    } else {
      e.target.innerHTML = 'Show';
      editRePass.setAttribute('type', 'password');
    }
  });

  logoutBtn.addEventListener('click', () => {
    const res = confirm('Are you want to logout?');
    if (res) {
      sessionStorage.removeItem('loginInfo');
      window.history.back();
    }
  });
  deleteAccBtn.addEventListener('click', () => {
    const res = confirm('Are you want to logout?');
    if (res) {
      let getIdAcc = 0;
      for (let item of arrInfos) if (loginInfo.idInfo === item.idAcc) getIdAcc = item.id;
      axios.delete(`http://localhost:3000/info/${getIdAcc}`);
      axios.delete(`http://localhost:3000/account/${loginInfo.id}`);
      axios.put(`http://localhost:3000/currentId`, {
        currentAcc: --currentId.currentAcc,
        currentInfo: --currentId.currentInfo,
      });
      sessionStorage.removeItem('loginInfo');
      window.history.back();
    }
  });

  const emptyWarning = (e) => {
    const warningTxt = e.target.nextElementSibling;
    const warningStyle = {
      border: '1px solid #f00',
      backgroundColor: '#eee',
    };
    warningTxt.style.visibility = 'visible';

    if (e.target.value === '') {
      Object.assign(e.target.style, warningStyle);
      warningTxt.innerHTML = 'Can not be empty';
    } else {
      e.target.style = '';
      warningTxt.style = '';
    }
  };

  editName.addEventListener('blur', emptyWarning);
  editAge.addEventListener('blur', emptyWarning);
  editPass.addEventListener('blur', emptyWarning);
  editRePass.addEventListener('blur', emptyWarning);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const containNumRegex = /(?=.*[0-9])/;
    const checkPassRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    let flagName = (flagAge = flagPass = flagRePass = false);

    const warningStyle = {
      border: '1px solid #f00',
      backgroundColor: '#eee',
    };

    const checkNameValidate = () => {
      let warningTxt = editName.nextElementSibling;
      warningTxt.style.visibility = 'visible';
      Object.assign(editName.style, warningStyle);

      if (editName.value === '') warningTxt.innerHTML = 'Can not be empty';
      else if (containNumRegex.test(editName.value))
        warningTxt.innerHTML = 'Can not have number in name';
      else {
        warningTxt.style.visibility = 'hidden';
        editName.style = '';
        flagName = true;
      }
    };
    await checkNameValidate();

    const checkAgeValidate = () => {
      let warningTxt = editAge.nextElementSibling;
      warningTxt.style.visibility = 'visible';
      Object.assign(editAge.style, warningStyle);

      if (editAge.value === '') warningTxt.innerHTML = 'Can not be empty';
      else if (!containNumRegex.test(editAge.value)) warningTxt.innerHTML = 'Only have number';
      else if (editAge.value <= 0 || editAge.value >= 100)
        warningTxt.innerHTML = 'Age only between 1 to 100';
      else {
        warningTxt.style.visibility = 'hidden';
        editAge.style = '';
        flagAge = true;
      }
    };
    checkAgeValidate();

    const checkPassValidate = () => {
      let warningTxt = editPass.nextElementSibling;
      warningTxt.style.visibility = 'visible';
      Object.assign(editPass.style, warningStyle);

      if (editPass.value === '') warningTxt.innerHTML = 'Can not be empty';
      else if (!checkPassRegex.test(editPass.value)) warningTxt.innerHTML = 'Invalid password';
      else {
        warningTxt.style.visibility = 'hidden';
        editPass.style = '';
        flagPass = true;
      }
    };
    checkPassValidate();

    const checkRePassValidate = () => {
      let warningTxt = editRePass.nextElementSibling;
      warningTxt.style.visibility = 'visible';
      Object.assign(editRePass.style, warningStyle);

      if (editRePass.value === '') warningTxt.innerHTML = 'Can not be empty';
      else if (editRePass.value !== editPass.value)
        warningTxt.innerHTML = 'Two password must be match';
      else {
        warningTxt.style.visibility = 'hidden';
        editRePass.style = '';
        flagRePass = true;
      }
    };
    checkRePassValidate();

    if (flagName && flagAge && flagPass && flagRePass) {
      if (!accInfo.id && !accInfo.idAcc) {
        let idInfoIncrease = ++currentId.currentInfo;
        accInfo.id = idInfoIncrease;
        accInfo.idAcc = loginInfo.id;
        accInfo.name = editName.value;
        accInfo.age = editAge.value;
        loginInfo.idInfo = accInfo.id;

        axios.post(`http://localhost:3000/info`, accInfo);
        axios.put(`http://localhost:3000/account/${loginInfo.id}`, loginInfo);
        axios.put(`http://localhost:3000/currentId`, {
          ...currentId,
          currentInfo: idInfoIncrease,
        });
        alert('Your info was add');
      } else if (editName.value !== accInfo.name || editAge.value !== accInfo.age) {
        axios.put(`http://localhost:3000/info/${accInfo.id}`, {
          ...accInfo,
          name: editName.value,
          age: editAge.value,
        });
        alert('Your info was changed');
      }
      if (editPass.value !== loginInfo.password && editPass.value === editRePass.value) {
        axios.put(`http://localhost:3000/account/${loginInfo.id}`, {
          ...loginInfo,
          password: editPass.value,
        });
        alert('Password changed');
      }
    }
  });
}
