const NOTICE_STORAGE_KEY = 'cctlab-notices';
const ADMIN_SESSION_KEY = 'cctlab-admin-session';

// Static hosting only: move authentication to a backend for real admin-only control.
const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'cctlab1234';

const UI_TEXT = {
  emptyList: '등록된 공지사항이 없습니다.',
  selectNotice: '왼쪽 목록에서 공지를 선택하세요.',
  loginRequired: '관리자 로그인 후 공지사항을 등록할 수 있습니다.',
  loginSuccess: '관리자 로그인 상태입니다. 새 공지를 등록할 수 있습니다.',
  loginFailed: '아이디 또는 비밀번호가 일치하지 않습니다.',
  missingFields: '제목과 내용을 모두 입력하세요.',
  created: '공지사항이 등록되었습니다.',
  count: (total) => `총 ${total}건`,
  meta: (date) => `작성일 ${date}`,
};

const seedNotices = [
  {
    id: 1,
    title: '2026년 봄학기 연구실 세미나 일정 안내',
    content:
      '3월부터 매주 수요일 오후 4시에 정기 세미나를 진행합니다. 발표 순서는 추후 공지합니다.',
    createdAt: '2026-03-02',
  },
  {
    id: 2,
    title: '학부연구생 모집 공고',
    content:
      '청정에너지 및 순환공정 분야 연구에 관심 있는 학부연구생을 모집합니다. 지원 문의는 연락처 페이지를 참고하세요.',
    createdAt: '2026-03-05',
  },
];

const noticeTableBody = document.getElementById('notice-table-body');
const noticeDetail = document.getElementById('notice-detail');
const noticeEmpty = document.getElementById('notice-empty');
const noticeCount = document.getElementById('notice-count');
const loginForm = document.getElementById('admin-login-form');
const loginMessage = document.getElementById('admin-login-message');
const noticeForm = document.getElementById('notice-form');
const logoutBtn = document.getElementById('logout-btn');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');

const getStoredNotices = () => {
  const raw = localStorage.getItem(NOTICE_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(seedNotices));
    return [...seedNotices];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...seedNotices];
  } catch {
    localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(seedNotices));
    return [...seedNotices];
  }
};

const saveNotices = (notices) => {
  localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(notices));
};

const isAdminLoggedIn = () => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';

const setMessage = (message) => {
  if (!loginMessage) {
    return;
  }

  loginMessage.textContent = message;
  loginMessage.classList.remove('hidden');
};

const setAdminState = (loggedIn) => {
  sessionStorage.setItem(ADMIN_SESSION_KEY, loggedIn ? 'true' : 'false');
  noticeForm?.classList.toggle('hidden', !loggedIn);
  logoutBtn?.classList.toggle('hidden', !loggedIn);
  loginForm?.classList.toggle('hidden', loggedIn);
  setMessage(loggedIn ? UI_TEXT.loginSuccess : UI_TEXT.loginRequired);
};

const renderNoticeDetail = (notice) => {
  if (!noticeDetail) {
    return;
  }

  if (!notice) {
    noticeDetail.classList.add('empty');
    noticeDetail.textContent = UI_TEXT.selectNotice;
    return;
  }

  noticeDetail.classList.remove('empty');
  noticeDetail.innerHTML = `
    <h4>${notice.title}</h4>
    <p class="notice-meta">${UI_TEXT.meta(notice.createdAt)}</p>
    <div class="notice-body">${notice.content.replace(/\n/g, '<br />')}</div>
  `;
};

const renderNoticeTable = () => {
  const notices = getStoredNotices().sort((a, b) => b.id - a.id);
  if (!noticeTableBody) {
    return;
  }

  noticeTableBody.innerHTML = '';

  if (noticeCount) {
    noticeCount.textContent = UI_TEXT.count(notices.length);
  }

  if (!notices.length) {
    noticeEmpty?.classList.remove('hidden');
    renderNoticeDetail(null);
    return;
  }

  noticeEmpty?.classList.add('hidden');

  notices.forEach((notice, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${notices.length - index}</td>
      <td><button type="button" class="table-link" data-notice-id="${notice.id}">${notice.title}</button></td>
      <td>${notice.createdAt}</td>
    `;
    noticeTableBody.appendChild(row);
  });

  renderNoticeDetail(notices[0]);
};

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const adminId = document.getElementById('admin-id')?.value.trim();
  const adminPassword = document.getElementById('admin-password')?.value.trim();

  if (adminId === ADMIN_ID && adminPassword === ADMIN_PASSWORD) {
    setAdminState(true);
    loginForm.reset();
    return;
  }

  setMessage(UI_TEXT.loginFailed);
});

logoutBtn?.addEventListener('click', () => {
  setAdminState(false);
});

noticeForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput?.value.trim() ?? '';
  const content = contentInput?.value.trim() ?? '';

  if (!title || !content) {
    setMessage(UI_TEXT.missingFields);
    return;
  }

  const notices = getStoredNotices();
  const nextId = notices.length ? Math.max(...notices.map((item) => item.id)) + 1 : 1;
  const createdAt = new Date().toISOString().slice(0, 10);

  notices.push({
    id: nextId,
    title,
    content,
    createdAt,
  });

  saveNotices(notices);
  renderNoticeTable();
  renderNoticeDetail({ id: nextId, title, content, createdAt });
  noticeForm.reset();
  setMessage(UI_TEXT.created);
});

noticeTableBody?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const trigger = target.closest('[data-notice-id]');
  if (!trigger) {
    return;
  }

  const selectedId = Number(trigger.getAttribute('data-notice-id'));
  const notices = getStoredNotices();
  const selectedNotice = notices.find((item) => item.id === selectedId);
  renderNoticeDetail(selectedNotice ?? null);
});

if (noticeEmpty) {
  noticeEmpty.textContent = UI_TEXT.emptyList;
}

renderNoticeTable();
setAdminState(isAdminLoggedIn());
