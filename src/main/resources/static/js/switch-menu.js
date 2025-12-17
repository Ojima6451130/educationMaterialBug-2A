// ===========================
// ログイン直後はカーソル初期化（上下共通）
// ===========================
const params = new URLSearchParams(window.location.search);

if (params.get("reset") === "1") {
  localStorage.removeItem("menuIndex");
  localStorage.removeItem("bottomIndex");

  // URL をきれいに
  history.replaceState(null, "", window.location.pathname);
}


let isSleeping = false;

// ===========================
// 初回アクセス判定（menu 直アクセス時のみ index を消す）
// ===========================
if (!document.referrer.includes("/kikin")) {
  localStorage.removeItem("menuIndex");
}

// ===========================
// Switch ホームメニュー制御
// ===========================

// 上段カード
const menu = document.getElementById("menu");
const cards = document.querySelectorAll(".app-card");
const selectFrame = document.querySelector(".select-frame");

menu._x = 0;

let index = 0;
const savedIndex = localStorage.getItem("menuIndex");
if (savedIndex !== null) {
  index = parseInt(savedIndex, 10);
}

let bottomIndex = 0;
const savedBottomIndex = localStorage.getItem("bottomIndex");
if (savedBottomIndex !== null) {
  bottomIndex = parseInt(savedBottomIndex, 10);
}

const seDecide = new Audio("/sound/Nintendo_Switch_起動音.wav");
seDecide.volume = 0.4;


// フォーカス状態（true = 上段, false = 下段）
let focusTop = true;


// ===========================
// 下段システムメニュー
// ===========================
const bottomItems = document.querySelectorAll(".system-icon");
const bottomFrame = document.getElementById("bottomSelectFrame");


// ===========================
// 初期表示
// ===========================
updateMenuPosition();
updateScale();
updateSelectFrame();


// ===========================
// 上段カード位置調整
// ===========================
function updateMenuPosition() {

    const wrapper = document.querySelector(".menu-wrapper");
    const wrapperRect = wrapper.getBoundingClientRect();

    const screenLeft = wrapperRect.left;
    const screenRight = wrapperRect.right;

    const cardRect = cards[index].getBoundingClientRect();
    const leftSafe = screenLeft + 120;
    const rightSafe = screenRight - 120;

    let newX = menu._x;

    if (cardRect.left < leftSafe) {
        newX += (leftSafe - cardRect.left);
    } else if (cardRect.right > rightSafe) {
        newX -= (cardRect.right - rightSafe);
    }

    menu._x = newX;
    menu.style.transform = `translateX(${newX}px)`;
}


// ===========================
// 上段カードの拡大
// ===========================
function updateScale() {
    cards.forEach((card, i) => {
        const isActive = (i === index);
        card.classList.toggle("active", isActive); // ← これを追加！
    });
}


// ===========================
// 上段の選択枠
// ===========================
function updateSelectFrame() {
    const rect = cards[index].getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const x = rect.left - menuRect.left - 6;
    const y = rect.top - menuRect.top;

    selectFrame.style.transform = `translate(${x}px, ${y}px)`;
}


// ===========================
// 下段の選択枠
// ===========================
function updateBottomFrame() {
    // 全アイコンから active を外す
    bottomItems.forEach(item => item.classList.remove("active"));

    // 選択中に active を付ける
    const item = bottomItems[bottomIndex];
    item.classList.add("active");

    // 位置計算
    const rect = item.getBoundingClientRect();
    const parentRect = document.querySelector(".system-menu").getBoundingClientRect();

    const x = rect.left - parentRect.left + 7;
    const y = rect.top - parentRect.top - 4;

    bottomFrame.style.opacity = 1;
    bottomFrame.style.transform = `translate(${x}px, ${y}px)`;
}




// ===========================
// キー操作（Switch 風）
// ===========================
document.addEventListener("keydown", (e) => {

  // スリープ中
  if (isSleeping) {
    if (e.key === "Escape") {
      toggleSleep(); // 復帰
    }
    return;
  }

  handleInput(e.key);
});




// ===========================
// Switch風：ページ遷移アニメ
// ===========================
function playLaunchAnimation(card, url) {

    card.classList.add("icon-zoom");

    const flash = document.getElementById("flash");
    setTimeout(() => (flash.style.opacity = 1), 150);

    setTimeout(() => (window.location.href = url), 350);
}


// ===========================
// カードのクリックもアニメにする
// ===========================

document.querySelectorAll(".app-card").forEach((card, i) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();

    // ★ ここも保存
    localStorage.setItem("menuIndex", i);

    const link = card.querySelector("a");
    if (link) playLaunchAnimation(card, link.href);
  });
});



// ===========================
// 時計更新
// ===========================
function updateClock() {
    const now = new Date();
    document.getElementById("clock").textContent =
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
updateClock();
setInterval(updateClock, 30000);

function updateBottomHelp() {
    const plus = document.getElementById("help-plus");
    const aStart = document.getElementById("help-a-start");
    const aSelect = document.getElementById("help-a-select");

    if (focusTop) {
        // 上段アイコンのとき
        plus.style.display = "inline";
        aStart.style.display = "inline";
        aSelect.style.display = "none";
    } else {
        // 下段アイコンのとき
        plus.style.display = "none";
        aStart.style.display = "none";
        aSelect.style.display = "inline";
    }
}

function hideAllTopTitles() {
    document.querySelectorAll(".app-title").forEach(t => {
        t.style.opacity = "0";
    });
}
function showActiveTopTitle() {
    document.querySelectorAll(".app-title").forEach((t, i) => {
        t.style.opacity = (i === index) ? "1" : "0";
    });
}

function handleInput(key) {
    // keydown の e.key と同じ値を渡す想定

    // HOME
    if (key === "h" || key === "H") {
        index = Math.floor(cards.length / 2);
        focusTop = true;
        updateMenuPosition();
        updateScale();
        updateSelectFrame();
        bottomFrame.style.opacity = 0;
        updateBottomHelp();
        return;
    }

    // ===========================
    // 上段フォーカス
    // ===========================
    if (focusTop) {
        if (key === "ArrowRight" && index < cards.length - 1) index++;
        if (key === "ArrowLeft" && index > 0) index--;

        updateMenuPosition();
        updateScale();
        updateSelectFrame();
        showActiveTopTitle();

        // 下段へ
        if (key === "ArrowDown") {
            focusTop = false;
            hideAllTopTitles();
            selectFrame.style.opacity = 0;
            updateBottomFrame();
            updateBottomHelp();
            return;
        }

		if (key === "Enter") {

		  // ★ 上段で遷移したことを明示
		  localStorage.setItem("menuFocus", "top");
		  localStorage.setItem("menuIndex", index);

		  // ★ 下段の履歴は必ず消す
		  localStorage.removeItem("bottomIndex");


		  const link = cards[index].querySelector("a");
		  if (link) playLaunchAnimation(cards[index], link.href);
		}


		

        return;
    }

    // ===========================
    // 下段フォーカス
    // ===========================
    if (!focusTop) {
        if (key === "ArrowRight" && bottomIndex < bottomItems.length - 1) bottomIndex++;
        if (key === "ArrowLeft" && bottomIndex > 0) bottomIndex--;

        updateBottomFrame();
        updateBottomHelp();

        // 上段へ戻る
        if (key === "ArrowUp") {
            focusTop = true;
            bottomItems.forEach(item => item.classList.remove("active"));
            showActiveTopTitle();
            bottomFrame.style.opacity = 0;
            updateSelectFrame();
            selectFrame.style.opacity = 1;
            updateBottomHelp();
            return;
        }

		if (key === "Enter") {
		  const item = bottomItems[bottomIndex];

		  // ★ 下段で遷移したことを保存
		  localStorage.setItem("menuFocus", "bottom");
		  localStorage.setItem("bottomIndex", bottomIndex);

		  if (item.dataset.action === "sleep") {
		    toggleSleep();
		    return;
		  }

		  const url = item.dataset.url;
		  if (url) playLaunchAnimation(item, url);
		}



    }
}

document.querySelectorAll(".joy-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    // ★ HOMEボタン（ログアウト）
    if (btn.dataset.action === "logout") {
      logout();
      return;
    }

    const key = btn.dataset.key;
    handleInput(key);
  });
});


window.addEventListener("pageshow", () => {

  // ===== 共通リセット =====
  isSleeping = false;

  const overlay = document.getElementById("sleepOverlay");
  if (overlay) overlay.classList.remove("active");

  const flash = document.getElementById("flash");
  if (flash) flash.style.opacity = 0;

  // ===== 保存状態取得 =====
  const focus = localStorage.getItem("menuFocus");

  // ======================
  // 上段復帰
  // ======================
  if (focus === "top" || focus === null) {

    focusTop = true;

    const savedIndex = localStorage.getItem("menuIndex");
    if (savedIndex !== null) {
      index = parseInt(savedIndex, 10);
    }

    bottomItems.forEach(i => i.classList.remove("active"));
    bottomFrame.style.opacity = 0;

    updateMenuPosition();
    updateScale();
    updateSelectFrame();
    showActiveTopTitle();
    selectFrame.style.opacity = 1;
    updateBottomHelp();

    return;
  }

  // ======================
  // 下段復帰
  // ======================
  if (focus === "bottom") {

    focusTop = false;

    const savedBottomIndex = localStorage.getItem("bottomIndex");
    if (savedBottomIndex !== null) {
      bottomIndex = parseInt(savedBottomIndex, 10);
    }

    hideAllTopTitles();
    selectFrame.style.opacity = 0;

    updateBottomFrame();
    updateBottomHelp();
  }

});





// ===========================
// ログアウト
// ===========================
	
function logout() {
  window.location.href = "/kikin/logout";
  const flash = document.getElementById("flash");
    if (flash) {
      flash.style.opacity = 1;
    }
}

// ===========================
// スリープ切り替え
// ===========================
function toggleSleep() {
  const overlay = document.getElementById("sleepOverlay");

  if (!overlay) return;

  if (!isSleeping) {
    // スリープON
    isSleeping = true;
    overlay.classList.add("active");
  } else {
    // スリープOFF
    isSleeping = false;
    overlay.classList.remove("active");
  }
}
