// ======================================
// نظام مواقيت الصلاة - الدكتورة ملك
// ======================================


const prayerElements = {

  Fajr:
    document.getElementById("fajrTime"),

  Dhuhr:
    document.getElementById("dhuhrTime"),

  Asr:
    document.getElementById("asrTime"),

  Maghrib:
    document.getElementById("maghribTime"),

  Isha:
    document.getElementById("ishaTime")

};


let prayerTimes = {};


// الحصول على الموقع

function getLocationForPrayer() {

  if (!navigator.geolocation) {

    // القاهرة كاحتياطي
    getPrayerTimes(
      30.0444,
      31.2357
    );

    return;

  }


  navigator.geolocation.getCurrentPosition(

    position => {

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;


      getPrayerTimes(
        latitude,
        longitude
      );

    },


    error => {

      console.log(
        "تم استخدام الموقع الاحتياطي"
      );


      // القاهرة كاحتياطي

      getPrayerTimes(
        30.0444,
        31.2357
      );

    },


    {

      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 3600000

    }

  );

}


// جلب المواقيت

async function getPrayerTimes(
  latitude,
  longitude
) {

  try {

    const today =
      new Date();


    const day =
      String(
        today.getDate()
      ).padStart(2, "0");


    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");


    const year =
      today.getFullYear();


    const date =
      `${day}-${month}-${year}`;


    // الطريقة 5 = الهيئة المصرية العامة للمساحة

    const url =
      `https://api.aladhan.com/v1/timings/${date}` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&method=5`;


    const response =
      await fetch(url);


    const result =
      await response.json();


    if (
      result.code === 200
    ) {

      prayerTimes =
        result.data.timings;


      updatePrayerUI();

    }

  } catch (error) {

    console.error(
      "خطأ في تحميل مواقيت الصلاة:",
      error
    );


    document.getElementById(
      "nextPrayerName"
    ).textContent =
      "تعذر تحميل المواقيت";

  }

}


// تنسيق الوقت

function cleanPrayerTime(time) {

  return time
    .replace(
      /\s*\(.+\)/,
      ""
    )
    .trim();

}


// تحديث الشاشة

function updatePrayerUI() {

  prayerElements.Fajr.textContent =
    cleanPrayerTime(
      prayerTimes.Fajr
    );


  prayerElements.Dhuhr.textContent =
    cleanPrayerTime(
      prayerTimes.Dhuhr
    );


  prayerElements.Asr.textContent =
    cleanPrayerTime(
      prayerTimes.Asr
    );


  prayerElements.Maghrib.textContent =
    cleanPrayerTime(
      prayerTimes.Maghrib
    );


  prayerElements.Isha.textContent =
    cleanPrayerTime(
      prayerTimes.Isha
    );


  updateNextPrayer();

}


// الصلوات

const prayerNames = {

  Fajr: "الفجر",

  Dhuhr: "الظهر",

  Asr: "العصر",

  Maghrib: "المغرب",

  Isha: "العشاء"

};


function getTimeDate(timeString) {

  const cleanTime =
    cleanPrayerTime(timeString);


  const parts =
    cleanTime.split(":");


  const date =
    new Date();


  date.setHours(
    Number(parts[0]),
    Number(parts[1]),
    0,
    0
  );


  return date;

}


// الصلاة القادمة

function updateNextPrayer() {

  if (
    !prayerTimes.Fajr
  ) return;


  const now =
    new Date();


  const prayers = [

    "Fajr",

    "Dhuhr",

    "Asr",

    "Maghrib",

    "Isha"

  ];


  let nextPrayer = null;


  for (
    const prayer of prayers
  ) {

    const prayerDate =
      getTimeDate(
        prayerTimes[prayer]
      );


    if (
      prayerDate > now
    ) {

      nextPrayer = {

        key: prayer,

        date: prayerDate

      };

      break;

    }

  }


  // بعد العشاء: الصلاة القادمة فجر الغد

  if (!nextPrayer) {

    const tomorrow =
      new Date();


    tomorrow.setDate(
      tomorrow.getDate() + 1
    );


    const time =
      cleanPrayerTime(
        prayerTimes.Fajr
      );


    const parts =
      time.split(":");


    tomorrow.setHours(
      Number(parts[0]),
      Number(parts[1]),
      0,
      0
    );


    nextPrayer = {

      key: "Fajr",

      date: tomorrow

    };

  }


  document.getElementById(
    "nextPrayerName"
  ).textContent =
    nextPrayer.key === "Fajr" &&
    nextPrayer.date.getDate() !==
    now.getDate()

      ? "الفجر القادم"

      : prayerNames[nextPrayer.key];


  document.getElementById(
    "nextPrayerTime"
  ).textContent =
    cleanPrayerTime(
      prayerTimes[nextPrayer.key]
    );


  updatePrayerCountdown(
    nextPrayer
  );

}


// العداد حتى الصلاة

function updatePrayerCountdown(
  nextPrayer
) {

  clearInterval(
    window.prayerCountdownInterval
  );


  function tick() {

    const now =
      new Date();


    const difference =
      nextPrayer.date - now;


    if (
      difference <= 0
    ) {

      clearInterval(
        window.prayerCountdownInterval
      );


      handlePrayerTime(
        nextPrayer.key
      );


      updateNextPrayer();

      return;

    }


    const hours =
      Math.floor(
        difference /
        (1000 * 60 * 60)
      );


    const minutes =
      Math.floor(
        (
          difference %
          (1000 * 60 * 60)
        ) /
        (1000 * 60)
      );


    const seconds =
      Math.floor(
        (
          difference %
          (1000 * 60)
        ) /
        1000
      );


    document.getElementById(
      "prayerCountdown"
    ).textContent =
      `باقي ${hours} س ${minutes} د ${seconds} ث`;

  }


  tick();


  window.prayerCountdownInterval =
    setInterval(
      tick,
      1000
    );

}


// عند دخول الصلاة

function handlePrayerTime(
  prayerKey
) {

  const name =
    prayerNames[prayerKey];


  showPrayerNotification(
    name
  );


  if (
    window.prayerSoundEnabled
  ) {

    playAdhan();

  }

}


// إشعار

function showPrayerNotification(
  prayerName
) {

  if (
    "Notification" in window &&
    Notification.permission === "granted"
  ) {

    new Notification(
      `حان الآن وقت صلاة ${prayerName}`,
      {

        body:
          "حي على الصلاة، حي على الفلاح 🕌",

        icon:
          "https://cdn-icons-png.flaticon.com/512/2721/2721296.png"

      }
    );

  }


  document.title =
    `🕌 حان وقت صلاة ${prayerName}`;


  setTimeout(() => {

    document.title =
      "الدكتورة ملك | Study Dashboard";

  }, 15000);

}


// فحص كل دقيقة

setInterval(() => {

  updateNextPrayer();

}, 60000);


// تحديث المواقيت عند منتصف الليل

setInterval(() => {

  const now =
    new Date();


  if (
    now.getHours() === 0 &&
    now.getMinutes() === 5
  ) {

    getLocationForPrayer();

  }

}, 60000);


// تشغيل أول مرة

getLocationForPrayer();
