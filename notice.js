const noticeEntries = Array.from(document.querySelectorAll('.notice-entry'));
const noticeList = document.getElementById('notice-list');
const viewTitle = document.getElementById('notice-view-title');
const viewDate = document.getElementById('notice-view-date');
const viewContent = document.getElementById('notice-view-content');

const setNoticeView = (entry, button) => {
  if (!entry || !button || !viewTitle || !viewDate || !viewContent) {
    return;
  }

  document.querySelectorAll('.notice-trigger').forEach((item) => {
    item.classList.remove('is-active');
  });

  button.classList.add('is-active');

  const title = entry.querySelector('.notice-entry-title')?.textContent?.trim() ?? '';
  const date = entry.querySelector('.notice-entry-date')?.textContent?.trim() ?? '';
  const content = entry.querySelector('.notice-entry-content')?.textContent?.trim() ?? '';

  viewTitle.textContent = title;
  viewDate.textContent = date;
  viewContent.textContent = content;
};

const buildNoticeList = () => {
  if (!noticeList) {
    return;
  }

  noticeList.innerHTML = '';

  noticeEntries.forEach((entry, index) => {
    const title = entry.querySelector('.notice-entry-title')?.textContent?.trim() ?? '';
    const date = entry.querySelector('.notice-entry-date')?.textContent?.trim() ?? '';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'notice-item notice-trigger';
    button.innerHTML = `
      <span class="notice-date">${date}</span>
      <span class="notice-body">
        <strong class="notice-title">${title}</strong>
      </span>
    `;

    button.addEventListener('click', () => {
      setNoticeView(entry, button);
    });

    noticeList.appendChild(button);

    if (index === 0) {
      setNoticeView(entry, button);
    }
  });
};

buildNoticeList();
