// Project: AGSCraft software solutions officialsite
// Dev: Thamarai Selvan
// Started: 01/09/2023
// Ended: 07/09/2023

AOS.init({ offset: 200 });
emailjs.init("31wh_JFd1pkkG5i-F");

const hamburger = document.querySelector("#hamburger");
const mobileNav = document.querySelector("#mobile-nav");
const pageAnchors = document.querySelectorAll(".anchor");

// making an array from desktop and mobile nav items
const navItems = [
  ...document.querySelectorAll("nav a"),
  ...document.querySelectorAll("#mobile-nav a h3"),
];

const sun = document.querySelector(".fa-sun");
const moon = document.querySelector(".fa-moon");
const html = document.documentElement;

// hamburger functionalities
hamburger.onclick = () => {
  mobileNav.style.width = `100%`;
};
[...mobileNav.children].forEach(
  (child) => (child.onclick = () => (mobileNav.style.width = `0%`))
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
