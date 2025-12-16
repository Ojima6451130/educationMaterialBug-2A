const switchElem = document.getElementById("switch");
const flash = document.getElementById("flash");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginButtonA = document.getElementById("loginButtonA");





// ===========================
// 効果音
// ===========================
const seLogin = new Audio("/sound/Nintendo_Switch_起動音.wav");
seLogin.volume = 0.5;

// ===========================
// ふわふわ ＋ マウス傾き
// ===========================
document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 40;
  const y = (window.innerHeight / 2 - e.clientY) / 40;
  switchElem.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
});

// ===========================
// ログイン共通処理
// ===========================
function doLogin() {

  // ❌ ここでは鳴らさない
  // seLogin.play()

  switchElem.classList.add("zoom-in");
  flash.style.opacity = 1;

  setTimeout(() => {
    loginForm.submit();
  }, 400);
}


// ===========================
// ボタンクリック
// ===========================
function handleLoginConfirm(e) {
  if (e) e.preventDefault();

  seLogin.currentTime = 0;
  seLogin.play().catch(() => {});

  doLogin();
}

document.querySelectorAll('[data-action="login"]').forEach(btn => {
  btn.addEventListener("click", handleLoginConfirm);
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {

    seLogin.currentTime = 0;
    seLogin.play().catch(() => {});

    doLogin();
  }
});

