document.addEventListener('DOMContentLoaded', () => {
  const nextPrayerName = document.getElementById('nextPrayerName');
  const nextPrayerTime = document.getElementById('nextPrayerTime');
  const enableAudioBtn = document.getElementById('enableAudioBtn');
  const adhanAudio = document.getElementById('adhanAudio');

  let prayerTimings = null;
  let audioEnabled = false;
  let playedPrayers = {};

  enableAudioBtn?.addEventListener('click', () => {
    adhanAudio.play().then(() => {
      adhanAudio.pause();
      adhanAudio.currentTime = 0;
      audioEnabled = true;
      enableAudioBtn.textContent = '🔔 تم تفعيل التنبيه الصوتي بنجاح';
      enableAudioBtn.style.background = 'rgba(73, 199, 123, 0.4)';
    }).catch(err => console.log(err));
  });

  function initPrayerTimes() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchPrayerTimes(30.0444, 31.2357); // القاهرة عند رفض الإذن
        }
      );
    } else {
      fetchPrayerTimes(30.0444, 31.2357);
    }
  }

  function fetchPrayerTimes(lat, lng) {
    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=5`)
      .then(res => res.json())
      .then(data => {
        prayerTimings = data.data.timings;
        updateTimesUI(prayerTimings);
        checkPrayerTime();
        setInterval(checkPrayerTime, 10000);
      })
      .catch(() => {
        if (nextPrayerName) nextPrayerName.textContent = "تعذر جلب المواقيت";
      });
  }

  function updateTimesUI(timings) {
    document.getElementById('fajrTime').textContent = formatTime(timings.Fajr);
    document.getElementById('dhuhrTime').textContent = formatTime(timings.Dhuhr);
    document.getElementById('asrTime').textContent = formatTime(timings.Asr);
    document.getElementById('maghribTime').textContent = formatTime(timings.Maghrib);
    document.getElementById('ishaTime').textContent = formatTime(timings.Isha);
  }

  function formatTime(time24) {
    const [h, m] = time24.split(':');
    let hour = parseInt(h, 10);
    const ampms = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampms}`;
  }

  function checkPrayerTime() {
    if (!prayerTimings) return;

    const now = new Date();
    const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const mainPrayers = {
      'الفجر': prayerTimings.Fajr,
      'الظهر': prayerTimings.Dhuhr,
      'العصر': prayerTimings.Asr,
      'المغرب': prayerTimings.Maghrib,
      'العشاء': prayerTimings.Isha
    };

    Object.entries(mainPrayers).forEach(([name, time]) => {
      if (currentHM === time && !playedPrayers[name]) {
        if (audioEnabled && adhanAudio) {
          adhanAudio.play();
        }
        playedPrayers[name] = true;
      }
    });

    let nextName = '';
    let nextTimeStr = '';

    for (let [name, time] of Object.entries(mainPrayers)) {
      if (time > currentHM) {
        nextName = name;
        nextTimeStr = time;
        break;
      }
    }

    if (!nextName) {
      nextName = 'الفجر';
      nextTimeStr = prayerTimings.Fajr;
    }

    if (nextPrayerName) nextPrayerName.textContent = `الصلاة القادمة: ${nextName}`;
    if (nextPrayerTime) nextPrayerTime.textContent = formatTime(nextTimeStr);
  }

  initPrayerTimes();
});
