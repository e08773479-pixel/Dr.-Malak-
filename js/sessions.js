document.addEventListener('DOMContentLoaded', () => {
  const homeSessionsList = document.getElementById('homeSessionsList');
  const fullSessionsList = document.getElementById('fullSessionsList');
  const openModalBtn = document.getElementById('openModalBtn');
  const quickNewSessionBtn = document.getElementById('quickNewSessionBtn');
  const closeModalBtn = document.getElementById('closeModal');
  const sessionModal = document.getElementById('sessionModal');
  const saveSessionBtn = document.getElementById('saveSessionBtn');
  const subjectInput = document.getElementById('subjectInput');
  const sessionTimeInput = document.getElementById('sessionTimeInput');
  const sessionsCount = document.getElementById('sessionsCount');

  let sessions = JSON.parse(localStorage.getItem('dr_malak_sessions')) || [
    { subject: 'رياضيات', time: '09:00 ص' },
    { subject: 'فيزياء', time: '11:00 ص' }
  ];

  function saveAndRender() {
    localStorage.setItem('dr_malak_sessions', JSON.stringify(sessions));
    renderSessions();
  }

  function renderSessions() {
    const htmlContent = sessions.map((s, index) => `
      <div class="session-item">
        <button class="session-play">▶</button>
        <span class="session-time">${s.time}</span>
        <strong>${s.subject}</strong>
        <button class="delete-task" onclick="deleteSession(${index})">×</button>
      </div>
    `).join('');

    if (homeSessionsList) homeSessionsList.innerHTML = htmlContent;
    if (fullSessionsList) fullSessionsList.innerHTML = htmlContent;
    if (sessionsCount) sessionsCount.textContent = sessions.length;
  }

  window.deleteSession = (index) => {
    sessions.splice(index, 1);
    saveAndRender();
  };

  const openModal = () => sessionModal.classList.add('show');
  const closeModal = () => sessionModal.classList.remove('show');

  openModalBtn?.addEventListener('click', openModal);
  quickNewSessionBtn?.addEventListener('click', openModal);
  closeModalBtn?.addEventListener('click', closeModal);

  saveSessionBtn?.addEventListener('click', () => {
    const subject = subjectInput.value.trim();
    const time = sessionTimeInput.value;

    if (subject && time) {
      sessions.push({ subject, time });
      subjectInput.value = '';
      sessionTimeInput.value = '';
      closeModal();
      saveAndRender();
    }
  });

  renderSessions();
});
