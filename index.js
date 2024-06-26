// Project: AGKSCraft software solutions officialsite
// Dev: Thamarai Selvan
// Started: 01/09/2023
// Ended: 07/09/2023

AOS.init({ offset: 200 });
emailjs.init("31wh_JFd1pkkG5i-F");

const hamburger = document.querySelector("#hamburger");
const mobileNav = document.querySelector("#mobile-nav");
const pageAnchors = document.querySelectorAll(".anchor");
const navItems = [
  ...document.querySelectorAll("nav a"),
  ...document.querySelectorAll("#mobile-nav a h3"),
];
const sun = document.querySelector(".fa-sun");
const moon = document.querySelector(".fa-moon");
const html = document.documentElement;
const marquee = document.querySelector("marquee");
const cards = document.querySelectorAll(".card");

// color scheme
const switchColorSchemeIcons = (isDark) =>
  isDark
    ? ((sun.style.display = "none"), (moon.style.display = "block"))
    : ((sun.style.display = "block"), (moon.style.display = "none"));

const switchColorScheme = (key) => {
  key
    ? (html.dataset.colorScheme = "dark")
    : (html.dataset.colorScheme = "light");

  switchColorSchemeIcons(key);
};

switchColorScheme(window.matchMedia("(prefers-color-scheme: dark)").matches);

// hamburger functionalities
hamburger.onclick = () => {
  mobileNav.style.width = `100%`;
};
[...mobileNav.children].forEach(
  (child) => (child.onclick = () => (mobileNav.style.width = `0%`)),
);

document.querySelectorAll("section").forEach(
  (section) =>
    (section.onclick = () => {
      if (mobileNav.style.width == `100%`) {
        mobileNav.style.width = `0%`;
      }
    }),
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navItems.forEach((item) => {
        if (item.innerHTML == entry.target.dataset.page) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
  });
});

pageAnchors.forEach((anchor) => observer.observe(anchor));

for (let i = 0; i < 10; i++) {
  cards.forEach((card) => marquee.appendChild(card.cloneNode(true)));
}
let not = true;
document.querySelectorAll(".card").forEach((card) => {
  card.onmouseover = () => marquee.stop();
  card.onmouseleave = () => marquee.start();

  card.ontouchstart = () => {
    marquee[!not ? "start" : "stop"]();
    not = !not;
  };
});

function numberFilter(e) {
  if (
    !/[0-9]/.test(e.key) &&
    e.key != "Backspace" &&
    e.key != "ArrowLeft" &&
    e.key != "ArrowRight"
  )
    e.preventDefault();
}

// firebase
const db = firebase.firestore();

function sendMessage(e, name, phone, email, message) {
  e.preventDefault();

  db.collection("messages")
    .add({
      name,
      phone,
      email,
      message,
      date: new Date().toISOString(),
    })
    .then((r) => {
      console.log(r);
      e.target.reset();
      alert("Response received!");
    })
    .catch((e) => console.error(e));

  emailjs.send("contactForm", "ContactFormID", {
    message: `Name: ${name}\n
    Phone: ${phone}\n
    E-mail: ${email}\n
    Message: ${message}`,
    user_email: email,
  });
}

const getCertificate = (e, id) => {
  e.preventDefault();
  firebase
    .storage()
    .ref(`certificates/${id}.jpg`)
    .getDownloadURL()
    .then(async (res) => {
      errMsg.style.display = "none";
      certificateImg.src = res;
      certificateDownload.href = res;
      await fetch("https://t.ly/api/v1/link/shorten", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 3Ap5EPTk2Yw5llJ80BWxVC6wfwNOz6IVauenRPxLH4l6P47Tfc3poTSR0Pxb",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          long_url: res,
          domain: "https://t.ly/",
        }),
      }).then((response) =>
        response.json().then((shrtndlnk) => {
          certificateQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${shrtndlnk.short_url}`;
        }),
      );
      certificateDownload.style.display = "block";
      certificateQr.style.display = "block";
    })
    .catch((err) => {
      errMsg.innerText = "Certificate cannot be found";
      errMsg.style.display = "block";
      certificateQr.style.display = "none";
    });
};
