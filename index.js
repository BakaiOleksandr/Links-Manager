const createFolderButton = document.querySelector('.create-folder-btn');
const foldersContainer = document.querySelector('.folders-container');
let foldersLocalArray = JSON.parse(localStorage.getItem('folders') || '[]');

//localStorage for FOLDERS
foldersLocalArray.forEach((fdata) => {
  const folder = document.createElement('div');
  folder.className = 'folder';
  folder.innerHTML = `<div class='delete-folder-container'>
        <button class='delete-folder'>Delete</button></div>
        <div class='btn-and-namefolder'>
        <button  class='btn-expandfolder'>▼</button>
        <div class='name-folder-container'>
        <p class='folder-name'>${fdata.name}</p>
        <button class='edit-foldername-btn'>Edit</button></div>
        <button class='create-url-btn'>Create URL</button>
        </div>
        `;
  foldersContainer.append(folder);
  deleteFolderListener(folder);
  CreateURLModalWindow(folder);

  const underFolderBtn = folder.querySelector('.btn-expandfolder');
  underFolderBtn.addEventListener('click', () => {
    createUnderFolderWindow(folder);
  });
  const editFolderNameBtn = folder.querySelector('.edit-foldername-btn');
  const folderName = folder.querySelector('.folder-name');
  editFolderNameBtn.addEventListener('click', () => {
    editFolderName(folderName);
  });
});
//MODAL WINDOW
function showModalWindow() {
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  modalContainer.innerHTML = `
  <h2>Write folder name</h2>
  <input type='text'
  autocomplete='off'
  maxlength='30' class='input-folder-name'></input>
  <button class='create-folder-btn'>Create Folder</button>
  <button class='close-modal-btn'>Close</button>
  `;
  document.body.append(modalContainer);
  const inputNameFolder = modalContainer.querySelector('.input-folder-name');
  const closeModalButton = modalContainer.querySelector('.close-modal-btn');

  inputNameFolder.focus();

  closeModalButton.addEventListener('click', () => {
    modalContainer.remove();
  });
  inputListener(inputNameFolder, modalContainer);
}
//INPUT LISTENER
function inputListener(inputNameFolder, modalContainer) {
  const createFolderButton = modalContainer.querySelector('.create-folder-btn');
  createFolderButton.addEventListener('click', () => {
    createFolder(inputNameFolder, modalContainer);
  });
  inputNameFolder.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createFolder(inputNameFolder, modalContainer);
    }
  });
}
function createFolder(inputNameFolder, modalContainer) {
  const inputValue = inputNameFolder.value.trim();
  if (!inputValue) {
    alert('Please enter name');
    return;
  }
  if (inputValue) {
    //create FOLDER
    const folder = document.createElement('div');
    folder.className = 'folder';
    folder.innerHTML = `<div class='delete-folder-container'>
        <button class='delete-folder'>Delete</button></div>
        <div class='btn-and-namefolder'>
        <button  class='btn-expandfolder'>▼</button>
        <div class='name-folder-container'>
        <p class='folder-name'></p>
        <button class='edit-foldername-btn'>Edit</button></div>
        <button class='create-url-btn'>Create URL</button>
        </div>
        `;
    const underFolderBtn = folder.querySelector('.btn-expandfolder');

    underFolderBtn.addEventListener('click', () =>
      createUnderFolderWindow(folder)
    );
    const folderName = folder.querySelector('.folder-name');
    folderName.textContent = inputValue;
    foldersContainer.append(folder);
    CreateURLModalWindow(folder);
    deleteFolderListener(folder);
    const editFolderNameBtn = folder.querySelector('.edit-foldername-btn');
    editFolderNameBtn.addEventListener('click', () => {
      editFolderName(folderName);
    });
    modalContainer.remove();
    foldersLocalArray.push({name: inputValue, links: []});
    localStorage.setItem('folders', JSON.stringify(foldersLocalArray));
  }
}
//Edit folder name
function editFolderName(folderName) {
  const currentFolderName = folderName.textContent.trim();
  folderName.innerHTML = `<input class='folder-name-input'
 type='text'
  placeholder='${currentFolderName}'
value='${currentFolderName}'></input>`;
  const inputChangeFolderName = folderName.querySelector('.folder-name-input');
  inputChangeFolderName.focus();
  inputChangeFolderName.select();

  function saveName() {
    const newFolderName =
      inputChangeFolderName.value.trim() || currentFolderName;
    if (newFolderName === currentFolderName) {
      folderName.textContent = currentFolderName;
      return;
    }
    const duplicate = foldersLocalArray.some(
      (f) => f.name.toLowerCase() === newFolderName.toLowerCase()
    );
    if (duplicate) {
      alert(`Folder ${newFolderName} has already exist!`);
      folderName.textContent = currentFolderName;
      return;
    }
    const targetFolder = foldersLocalArray.find(
      (f) => f.name === currentFolderName
    );
    if (targetFolder) {
      targetFolder.name = newFolderName;
      localStorage.setItem('folders', JSON.stringify(foldersLocalArray));
    }
    folderName.textContent = newFolderName;
  }
  inputChangeFolderName.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') saveName();
  });
}
//DELETE FOLDER LISTENER
function deleteFolderListener(folder) {
  const deleteFolderBTN = folder.querySelector('.delete-folder');
  deleteFolderBTN.addEventListener('click', () => {
    const folderName = folder.querySelector('.folder-name').textContent;

    let next = folder.nextElementSibling;
    while (next && next.classList.contains('underfolder-window')) {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }
    folder.remove();
    foldersLocalArray = foldersLocalArray.filter((f) => f.name !== folderName);
    localStorage.setItem('folders', JSON.stringify(foldersLocalArray));
  });
}
//MODALWINDOW FOR URL
function CreateURLModalWindow(folder) {
  const btnCreateURLModal = folder.querySelector('.create-url-btn');
  btnCreateURLModal.addEventListener('click', () => {
    const createURL = document.createElement('div');
    createURL.className = 'modal-url-window';
    createURL.innerHTML = `
      <h2>Copy and paste URL</h2>
      <input auocomplete='off' class='input-url-value'></input>
      <h2>Give a name of URL</h2>
      <input auocomplete='off' class='input-url-name'></input>
      <button class='submit-btn'>Submit</button>
      <button class='close-btn-url-modalwindow'>Close</button>`;
    document.body.append(createURL);
    const inputURLLink = createURL.querySelector('.input-url-value');
    const inputURLName = createURL.querySelector('.input-url-name');
    const btnCloseURLModal = createURL.querySelector(
      '.close-btn-url-modalwindow'
    );
    inputURLLink.focus();
    btnCloseURLModal.addEventListener('click', () => {
      createURL.remove();
    });
    const submitButton = createURL.querySelector('.submit-btn');
    submitButton.addEventListener('click', () => {
      createContentOfFolder(inputURLLink, inputURLName, folder, createURL);
    });
    inputURLName.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        createContentOfFolder(inputURLLink, inputURLName, folder, createURL);
      }
    });
  });
}
//CONTENT OF FOLDER
function createContentOfFolder(inputURLLink, inputURLName, folder, createURL) {
  const url = inputURLLink.value.trim();
  const urlName = inputURLName.value.trim();
  if (!url || !urlName) {
    alert('Please enter URL and name');
    return;
  }

  let underFolderWindow = folder.nextElementSibling;
  if (
    !underFolderWindow ||
    !underFolderWindow.classList.contains('underfolder-window')
  ) {
    underFolderWindow = document.createElement('div');
    folder.after(underFolderWindow);
    underFolderWindow.className = 'underfolder-window';
  }

  // delete text No links ,if it exist
  underFolderWindow.querySelectorAll('p').forEach((p) => {
    if (p.textContent === 'No links yet') {
      p.remove();
    }
  });

  // === create elements of links ===
  const linkContainer = document.createElement('div');
  linkContainer.className = 'link-container';

  const linkNameEl = document.createElement('p');
  linkNameEl.textContent = urlName;

  const linkEl = document.createElement('a');
  linkEl.setAttribute('href', url);
  linkEl.textContent = url;
  linkEl.target = '_blank';

  // === delete button ===
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-link-btn';
  deleteBtn.title = 'Delete this link';

  // === delete logic ===
  deleteBtn.addEventListener('click', () => {
    const folderName = folder.querySelector('.folder-name').textContent;
    const targetFolder = foldersLocalArray.find((f) => f.name === folderName);
    if (targetFolder) {
      targetFolder.links = targetFolder.links.filter(
        (l) => !(l.name === urlName && l.url === url)
      );
      localStorage.setItem('folders', JSON.stringify(foldersLocalArray));
    }
    linkContainer.remove();

    // if after removing links, there are no links - show
    if (targetFolder.links.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'No links yet';
      underFolderWindow.append(emptyMsg);
    }
  });

  // add everything in window
  linkContainer.append(
    linkNameEl,
    linkEl,
    deleteBtn,
    document.createElement('br')
  );
  underFolderWindow.append(linkContainer);

  // === save to localStorage ===
  const folderName = folder.querySelector('.folder-name').textContent;
  const targetFolder = foldersLocalArray.find((f) => f.name === folderName);
  if (targetFolder) {
    targetFolder.links.push({name: urlName, url});
    localStorage.setItem('folders', JSON.stringify(foldersLocalArray));
  }

  // close modal
  createURL.remove();
}

function createUnderFolderWindow(folder) {
  let next = folder.nextElementSibling;

  // if window is open - close
  if (next && next.classList.contains('underfolder-window')) {
    next.remove();
    return;
  }

  // Create links window
  let underFolderWindow = document.createElement('div');
  folder.after(underFolderWindow);
  underFolderWindow.className = 'underfolder-window';

  const folderName = folder.querySelector('.folder-name').textContent;
  const targetFolder = foldersLocalArray.find((f) => f.name === folderName);

  // if there is no links
  if (!targetFolder || targetFolder.links.length === 0) {
    underFolderWindow.innerHTML = `<p>No links yet</p>`;
    return;
  }

  // Show links
  targetFolder.links.forEach((linkObj, index) => {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'link-container';

    const linkName = document.createElement('p');
    linkName.textContent = linkObj.name;

    const link = document.createElement('a');
    link.href = linkObj.url;
    link.target = '_blank';
    link.textContent = linkObj.url;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-link-btn';
    deleteBtn.title = 'Delete this link';

    deleteBtn.addEventListener('click', () => {
      // Удаляем из массива
      targetFolder.links.splice(index, 1);
      // Обновляем localStorage
      localStorage.setItem('folders', JSON.stringify(foldersLocalArray));
      // Удаляем из DOM
      linkContainer.remove();

      // Если после удаления больше нет ссылок — показать "No links yet"
      if (targetFolder.links.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No links yet';
        underFolderWindow.appendChild(emptyMsg);
      }
    });

    linkContainer.append(
      linkName,
      link,
      deleteBtn,
      document.createElement('br')
    );
    underFolderWindow.appendChild(linkContainer);
  });
}
createFolderButton.addEventListener('click', showModalWindow);
//CLEAR STORAGE
// localStorage.clear();
