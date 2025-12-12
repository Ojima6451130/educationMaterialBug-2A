// ===========================
// Switch ホームメニュー制御
// ===========================

// 上段カード
const menu = document.getElementById("menu");
const cards = document.querySelectorAll(".app-card");
const selectFrame = document.querySelector(".select-frame");

let index = 0;
menu._x = 0;

// フォーカス状態（true = 上段, false = 下段）
let focusTop = true;


// ===========================
// 下段システムメニュー
// ===========================
const bottomItems = document.querySelectorAll(".system-icon");
const bottomFrame = document.getElementById("bottomSelectFrame");
let bottomIndex = 0;


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

    // ---------------------------
    // HOME：中央に戻る
    // ---------------------------
    if (e.key === "h" || e.key === "H") {
        index = Math.floor(cards.length / 2);
        focusTop = true;
        updateMenuPosition();
        updateScale();
        updateSelectFrame();
        bottomFrame.style.opacity = 0;
        return;
    }


    // ---------------------------
    // 上段フォーカス
    // ---------------------------
    if (focusTop) {

        if (e.key === "ArrowRight" && index < cards.length - 1) index++;
        if (e.key === "ArrowLeft" && index > 0) index--;

        updateMenuPosition();
        updateScale();
        updateSelectFrame();
		showActiveTopTitle();

		// ▼ 下段へ移動
		if (e.key === "ArrowDown") {
		    focusTop = false;

		    // ★ 上段タイトルをすべて消す（これが必要）
		    hideAllTopTitles();

		    selectFrame.style.opacity = 0;
		    updateBottomFrame();
		    updateBottomHelp();
		    return;
		}


        // ▼ Aボタン
        if (e.key === "Enter") {
            const url = cards[index].getAttribute("href");
            playLaunchAnimation(cards[index], url);
        }

        return;
    }


    // ---------------------------
    // 下段フォーカス
    // ---------------------------
    if (!focusTop) {

        if (e.key === "ArrowRight" && bottomIndex < bottomItems.length - 1) bottomIndex++;
        if (e.key === "ArrowLeft" && bottomIndex > 0) bottomIndex--;

        updateBottomFrame();
		updateBottomHelp(); 

		// ▼ 上段へ戻る
		if (e.key === "ArrowUp") {
		    focusTop = true;

		    // 下段 active を全て消す
		    bottomItems.forEach(item => item.classList.remove("active"));

		    // 選択中カードだけ active を復活
		    cards.forEach((card, i) => {
		        card.classList.toggle("active", i === index);
		    });

		    // ★ 選択中タイトルだけ復活させる
		    showActiveTopTitle();

		    bottomFrame.style.opacity = 0;
		    updateSelectFrame();
		    selectFrame.style.opacity = 1;
		    updateBottomHelp();
		    return;
		}


        // ▼ Aボタン
        if (e.key === "Enter") {
            const url = bottomItems[bottomIndex].getAttribute("href");
            playLaunchAnimation(bottomItems[bottomIndex], url);
        }

        return;
    }
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
document.querySelectorAll(".app-card").forEach(card => {
    card.addEventListener("click", (e) => {
        e.preventDefault();
        playLaunchAnimation(card, card.href);
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



