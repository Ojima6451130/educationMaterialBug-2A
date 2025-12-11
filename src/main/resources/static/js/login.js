const switchElem = document.getElementById("switch");
const flash = document.getElementById("flash");
const loginForm = document.querySelector("form");

/* ふわふわ ＋ マウス傾き */
document.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;
    switchElem.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
});

/* ログイン：ズーム → ホワイトフラッシュ */
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    switchElem.classList.add("zoom-in");
    flash.style.opacity = 1;

    setTimeout(() => {
        loginForm.submit();
    }, 400);
});

/* Bで戻る */
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "b") {
        switchElem.classList.add("go-back");

        setTimeout(() => {
            history.back();
        }, 300);
    }
});
