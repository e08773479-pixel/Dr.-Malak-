// ===================================
// نظام الصوت والأذان
// ===================================


const adhanAudio =
  document.getElementById(
    "adhanAudio"
  );


const finishAudio =
  document.getElementById(
    "finishAudio"
  );


const volumeSlider =
  document.getElementById(
    "adhanVolume"
  );


window.prayerSoundEnabled = false;


// مستوى الصوت

adhanAudio.volume =
  Number(volumeSlider.value);


volumeSlider.addEventListener(
  "input",
  () => {

    adhanAudio.volume =
      Number(volumeSlider.value);

  }
);


// تفعيل الصوت

document
  .getElementById(
    "enablePrayerSound"
  )
  .addEventListener(
    "click",
    async () => {

      window.prayerSoundEnabled = true;


      // طلب الإشعارات

      if (
        "Notification" in window
      ) {

        try {

          const permission =
            await Notification.requestPermission();


          console.log(
            "حالة الإشعارات:",
            permission
          );

        } catch (error) {

          console.log(error);

        }

      }


      const button =
        document.getElementById(
          "enablePrayerSound"
        );


      button.textContent =
        "✓ تم تفعيل التنبيهات والصوت";


      button.style.background =
        "rgba(54, 153, 100, 0.7)";


      alert(
        "🕌 تم تفعيل تنبيهات الصلاة. تأكدي أن ملف adhan.mp3 موجود داخل assets/audio."
      );

    }
  );


// تشغيل الأذان

function playAdhan() {

  if (
    !window.prayerSoundEnabled
  ) return;


  adhanAudio.currentTime = 0;


  adhanAudio.play()
    .catch(error => {

      console.log(
        "تعذر تشغيل الأذان تلقائياً:",
        error
      );

    });

}


// صوت انتهاء الجلسة

function playFinishSound() {

  if (!finishAudio) return;


  finishAudio.volume = 0.5;


  finishAudio.play()
    .catch(() => {

      // لو لا يوجد ملف صوت
      console.log(
        "يمكن إضافة finish.mp3"
      );

    });

}


// ================================
// صوت بسيط احتياطي
// ================================

function createSoftBell() {

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;


  if (
    !AudioContextClass
  ) return;


  const audioContext =
    new AudioContextClass();


  const oscillator =
    audioContext.createOscillator();


  const gain =
    audioContext.createGain();


  oscillator.connect(gain);

  gain.connect(
    audioContext.destination
  );


  oscillator.frequency.value =
    660;


  gain.gain.setValueAtTime(
    0.12,
    audioContext.currentTime
  );


  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 1.5
  );


  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + 1.5
  );

    }
