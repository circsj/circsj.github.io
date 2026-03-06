const noticeTriggers = Array.from(document.querySelectorAll('.notice-trigger'));
const viewTitle = document.getElementById('notice-view-title');
const viewDate = document.getElementById('notice-view-date');
const viewContent = document.getElementById('notice-view-content');

const setNoticeView = (button) => {
  if (!button || !viewTitle || !viewDate || !viewContent) {
    return;
  }

  noticeTriggers.forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');

  viewTitle.textContent = button.dataset.title ?? '';
  viewDate.textContent = button.dataset.date ?? '';
  viewContent.textContent = button.dataset.content ?? '';
};

noticeTriggers.forEach((button) => {
  button.addEventListener('click', () => {
    setNoticeView(button);
  });
});

if (noticeTriggers.length > 0) {
  setNoticeView(noticeTriggers[0]);
}
