// ================================
// الدكتورة ملك - نظام المذاكرة
// ================================


// التايمر

const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

const modeButtons = document.querySelectorAll(".mode-btn");

const sessionName = document.getElementById("sessionName");

const progressBar = document.querySelector(".progress-bar");

let totalTime = 2700;
let timeLeft = 2700;

let timerInterval = null;

let isRunning = false;


// محيط الدائرة

const radius = 118;
const circumference = 2 * Math.PI * radius;

progressBar.style.strokeDasharray = circumference;


// تحديث التايمر

function updateTimer() {

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progress = timeLeft / totalTime;

  progressBar.style.strokeDashoffset =
    circumference * (1 - progress);

}


// بدء

startBtn.addEventListener("click", () => {

  if (isRunning) return;

  isRunning = true;

  startBtn.textContent = "Ⅱ";

  timerInterval = setInterval(() => {

    if (timeLeft > 0) {

      timeLeft--;

      updateTimer();

    } else {

      finishSession();

    }

  }, 1000);

});


// إيقاف

stopBtn.addEventListener("click", () => {

  clearInterval(timerInterval);

  isRunning = false;

  startBtn.textContent = "▶";

});


// إعادة

resetBtn.addEventListener("click", () => {

  clearInterval(timerInterval);

  timeLeft = totalTime;

  isRunning = false;

  startBtn.textContent = "▶";

  updateTimer();

});


// انتهاء الجلسة

function finishSession() {

  clearInterval(timerInterval);

  isRunning = false;

  startBtn.textContent = "▶";

  addCompletedSession();

  playFinishSound();

  alert("🎉 أحسنتِ يا ملك! أنهيتِ جلسة مذاكرة كاملة ❤️");

}


// تغيير الوضع

modeButtons.forEach(button => {

  button.addEventListener("click", () => {

    clearInterval(timerInterval);

    isRunning = false;

    startBtn.textContent = "▶";

    modeButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    totalTime =
      Number(button.dataset.time);

    timeLeft = totalTime;

    sessionName.textContent =
      button.dataset.name;

    updateTimer();

  });

});


// ================================
// الإحصائيات
// ================================

let sessionsCount =
  Number(localStorage.getItem("sessionsCount")) || 0;

let totalStudySeconds =
  Number(localStorage.getItem("totalStudySeconds")) || 0;


function addCompletedSession() {

  sessionsCount++;

  totalStudySeconds += totalTime;

  localStorage.setItem(
    "sessionsCount",
    sessionsCount
  );

  localStorage.setItem(
    "totalStudySeconds",
    totalStudySeconds
  );

  updateStats();

}


function updateStats() {

  document.getElementById(
    "sessionsCount"
  ).textContent = sessionsCount;


  const hours =
    Math.floor(totalStudySeconds / 3600);

  const minutes =
    Math.floor(
      (totalStudySeconds % 3600) / 60
    );


  document.getElementById(
    "totalStudyTime"
  ).textContent =
    hours > 0
      ? `${hours} س ${minutes} د`
      : `${minutes} د`;


  document.getElementById(
    "todayTotal"
  ).textContent =
    `${hours} س ${minutes} د`;

}


updateStats();


// ================================
// رسائل تحفيزية
// ================================

const messages = [

  "النجاح ليس صدفة، هو نتيجة لجهد يومي صغير يتكرر.",

  "كل صفحة تذاكريها اليوم تقربك من حلمك.",

  "يا ملك، أنتِ أقوى من التعب وأكبر من أي خوف.",

  "لا تقلقي من طول الطريق، ركزي فقط على خطوتك القادمة.",

  "إن الله لا يضيع تعب من أحسن العمل.",

  "اجتهدي اليوم لتعيشي غداً فخورة بنفسك.",

  "ربِّ زدني علماً، وافتح لي أبواب الفهم والتوفيق.",

  "ما دام لديكِ حلم، فهناك سبب للاستمرار.",

  "التعب مؤقت، لكن فرحة النجاح تبقى في القلب.",

  "يا رب وفق ملك، وافتح لها أبواب النجاح والتفوق.",

  "100% ليست مجرد رقم، إنها نتيجة تعبك وإصرارك.",

  "ابدئي حتى لو لم تكوني مستعدة بالكامل، البداية تصنع الفرق.",

  "من جدّ وجد، ومن زرع حصد، واليوم يوم زرعك.",

  "اجعلي نيتك لله، وسيبارك الله لك في وقتك وعلمك.",

  "أنتِ قادرة يا دكتورة ملك، فقط لا تتوقفي."

];


let currentMessage = 0;

const dailyMessage =
  document.getElementById("dailyMessage");


function showMessage() {

  dailyMessage.style.opacity = "0";

  setTimeout(() => {

    dailyMessage.textContent =
      messages[currentMessage];

    dailyMessage.style.opacity = "1";

  }, 150);

}


document
  .getElementById("nextMessage")
  .addEventListener("click", () => {

    currentMessage =
      (currentMessage + 1) %
      messages.length;

    showMessage();

  });


document
  .getElementById("prevMessage")
  .addEventListener("click", () => {

    currentMessage =
      (currentMessage - 1 +
        messages.length) %
      messages.length;

    showMessage();

  });


// رسالة تلقائية كل 20 ثانية

setInterval(() => {

  currentMessage =
    (currentMessage + 1) %
    messages.length;

  showMessage();

}, 20000);


// ================================
// الملاحظات
// ================================

const notes =
  document.getElementById("notes");

const savedNotes =
  localStorage.getItem("malakNotes");

if (savedNotes) {

  notes.value = savedNotes;

}


notes.addEventListener("input", () => {

  localStorage.setItem(
    "malakNotes",
    notes.value
  );

  document.getElementById(
    "saveStatus"
  ).textContent =
    "✓ تم الحفظ تلقائياً";

});


document
  .getElementById("clearNotes")
  .addEventListener("click", () => {

    if (
      confirm(
        "هل تريدين مسح جميع الملاحظات؟"
      )
    ) {

      notes.value = "";

      localStorage.removeItem(
        "malakNotes"
      );

    }

  });


// ================================
// المهام
// ================================

const taskInput =
  document.getElementById("taskInput");

const tasksList =
  document.getElementById("tasksList");


let tasks =
  JSON.parse(
    localStorage.getItem("malakTasks")
  ) || [];


function renderTasks() {

  tasksList.innerHTML = "";


  tasks.forEach((task, index) => {

    const taskElement =
      document.createElement("div");

    taskElement.className =
      `task ${task.done ? "completed" : ""}`;


    taskElement.innerHTML = `

      <input
        type="checkbox"
        ${task.done ? "checked" : ""}
      >

      <span>${escapeHTML(task.text)}</span>

      <button class="delete-task">
        ×
      </button>

    `;


    const checkbox =
      taskElement.querySelector("input");


    checkbox.addEventListener("change", () => {

      tasks[index].done =
        checkbox.checked;

      saveTasks();

      renderTasks();

    });


    taskElement
      .querySelector(".delete-task")
      .addEventListener("click", () => {

        tasks.splice(index, 1);

        saveTasks();

        renderTasks();

      });


    tasksList.appendChild(taskElement);

  });


  updateCompletedTasks();

}


function addTask() {

  const text =
    taskInput.value.trim();

  if (!text) return;


  tasks.push({

    text: text,
    done: false

  });


  taskInput.value = "";

  saveTasks();

  renderTasks();

}


function saveTasks() {

  localStorage.setItem(
    "malakTasks",
    JSON.stringify(tasks)
  );

}


function updateCompletedTasks() {

  const completed =
    tasks.filter(
      task => task.done
    ).length;


  document.getElementById(
    "completedTasks"
  ).textContent = completed;

}


function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


document
  .getElementById("addTaskBtn")
  .addEventListener(
    "click",
    addTask
  );


taskInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      addTask();

    }

  }
);


renderTasks();


// ================================
// الجلسات
// ================================

const sessionModal =
  document.getElementById("sessionModal");


document
  .getElementById("newSessionBtn")
  .addEventListener("click", () => {

    sessionModal.classList.add("show");

  });


document
  .getElementById("closeModal")
  .addEventListener("click", () => {

    sessionModal.classList.remove("show");

  });


document
  .getElementById("saveSessionBtn")
  .addEventListener("click", () => {

    const subject =
      document
        .getElementById("subjectInput")
        .value
        .trim();


    const time =
      document
        .getElementById("sessionTimeInput")
        .value;


    if (!subject || !time) {

      alert(
        "اكتبي اسم المادة والوقت ❤️"
      );

      return;

    }


    addSessionToList(
      subject,
      time
    );


    document
      .getElementById("subjectInput")
      .value = "";


    sessionModal.classList.remove("show");

  });


function addSessionToList(
  subject,
  time
) {

  const item =
    document.createElement("div");

  item.className =
    "session-item";


  item.innerHTML = `

    <button class="session-play">
      ▶
    </button>

    <span class="session-time">
      ${time}
    </span>

    <strong>
      ${escapeHTML(subject)}
    </strong>

    <span class="waiting">
      ◷
    </span>

  `;


  document
    .getElementById("sessionsList")
    .appendChild(item);

}


// ================================
// القائمة
// ================================

document
  .querySelectorAll(".nav-item")
  .forEach(item => {

    item.addEventListener("click", () => {

      document
        .querySelectorAll(".nav-item")
        .forEach(nav =>
          nav.classList.remove("active")
        );

      item.classList.add("active");

    });

  });


// ================================
// بداية
// ================================

updateTimer();
