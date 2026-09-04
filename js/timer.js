document.addEventListener('DOMContentLoaded', () => {
  let timerInterval = null;
  let totalSeconds = 2700;
  let remainingSeconds = totalSeconds;
  let isRunning = false;

  const timerDisplay = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const stopBtn = document.getElementById('stopBtn');
  const sessionName = document.getElementById('sessionName');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const progressBar = document.getElementById('progressBar');

  const totalStudyTime = document.getElementById('totalStudyTime');
  const homeTotalStudyTime = document.getElementById('homeTotalStudyTime');

  const CIRCLE_CIRCUMFERENCE = 741;

  function setProgress(percent) {
    if (progressBar) {
      const offset = CIRCLE_CIRCUMFERENCE - (percent * CIRCLE_CIRCUMFERENCE);
      progressBar.style.strokeDashoffset = offset;
    }
  }

  function updateDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    setProgress(remainingSeconds / totalSeconds);
  }

  function updateStudyTime(addedMinutes) {
    let currentTotal = parseInt(localStorage.getItem('dr_malak_total_mins') || '0', 10);
    currentTotal += addedMinutes;
    localStorage.setItem('dr_malak_total_mins', currentTotal);
    renderTotalTime();
  }

  function renderTotalTime() {
    const currentTotal = localStorage.getItem('dr_malak_total_mins') || '0';
    if (totalStudyTime) totalStudyTime.textContent = `${currentTotal} دقيقة`;
    if (homeTotalStudyTime) homeTotalStudyTime.textContent = `${currentTotal} دقيقة`;
  }

  startBtn?.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = '⏸';

    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = '▶';
        alert('أحسنتِ يا دكتورة ملك! اكتملت الجلسة بنجاح 🎯');
        updateStudyTime(Math.floor(totalSeconds / 60));
      }
    }, 1000);
  });

  stopBtn?.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    if (startBtn) startBtn.textContent = '▶';
  });

  resetBtn?.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    if (startBtn) startBtn.textContent = '▶';
    remainingSeconds = totalSeconds;
    updateDisplay();
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      totalSeconds = parseInt(btn.getAttribute('data-time'), 10);
      remainingSeconds = totalSeconds;
      if (sessionName) sessionName.textContent = btn.getAttribute('data-name');

      clearInterval(timerInterval);
      isRunning = false;
      if (startBtn) startBtn.textContent = '▶';
      updateDisplay();
    });
  });

  renderTotalTime();
  updateDisplay();
});
