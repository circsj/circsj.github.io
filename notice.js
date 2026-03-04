const photoInput = document.getElementById('photo');
const previewImage = document.getElementById('preview-image');
const saveBtn = document.getElementById('save-btn');
const saveMessage = document.getElementById('save-message');
const titleInput = document.getElementById('title');

photoInput?.addEventListener('change', (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    previewImage.style.display = 'none';
    previewImage.removeAttribute('src');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target?.result;
    previewImage.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

saveBtn?.addEventListener('click', () => {
  const title = titleInput.value.trim();
  if (!title) {
    saveMessage.textContent = '제목을 입력한 뒤 저장해 주세요.';
    return;
  }

  const now = new Date();
  saveMessage.textContent = `"${title}" 공지를 임시 저장했습니다. (${now.toLocaleString('ko-KR')})`;
});
