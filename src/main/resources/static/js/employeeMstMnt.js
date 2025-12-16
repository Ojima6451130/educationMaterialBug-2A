// ===============================
// 社員マスタメンテナンス JS
// ===============================


// -------------------------------
// 社員アイコンクリック処理
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {

	const icons = document.querySelectorAll(".employee-icon");
	const detailPanel = document.getElementById("detailPanel");
	const detailName = document.getElementById("detailName");
	const detailIcon = document.getElementById("detailIcon");
	const forms = document.querySelectorAll(".detail-form");
	const readyBanner = document.getElementById("readyBanner");



	// employeeId → 画像ファイル名
	function getImagePath(employeeId) {
		const num = employeeId.replace("sh", "");
		return `/img/employee/${num}.png`;
	}

	icons.forEach(icon => {
		icon.addEventListener("click", () => {

			// すでに選択されている枠を解除
			icons.forEach(i => i.classList.remove("selected"));
			icon.classList.add("selected");

			// index を取得
			const index = icon.dataset.index;

			// 選択された社員ID
			const employeeId = icon.dataset.employeeId;

			// 選択された社員名
			const employeeName = icon.querySelector(".icon-name").innerText;

			// 左下パネルの名前差し替え
			detailName.textContent = employeeName;

			// 左下の画像差し替え
			detailIcon.src = getImagePath(employeeId);

			// 対応する詳細フォームを表示（active切り替え）
			forms.forEach(f => f.classList.remove("active"));
			const targetForm = document.getElementById(`detail_${index}`);
			if (targetForm) {
				targetForm.classList.add("active");
			}


			// パネルをスライド表示
			detailPanel.classList.add("active");
		showReadyBanner();
		});
	});

	// 初期表示：最初の社員を自動選択
	//if (icons.length > 0) {
	//icons[0].click();
	//}
});


function showReadyBanner() {
  const readyBanner = document.getElementById("readyBanner");
  if (!readyBanner) return;

  // 一度消す
  readyBanner.classList.remove("show");

  // 次フレームで再表示（アニメーションを必ず発火させる）
  setTimeout(() => {
     readyBanner.classList.add("show");
   }, 120); // ← 80〜150ms がちょうどいい
}



//document.querySelector(".employee-panel-inner")
	//.classList.add("active");


function employeeMstMntUpdate() {

	// ▼ 現在アクティブになっているフォームだけ対象
	var detailForm = document.querySelector(".detail-form.active");

	if (!detailForm) {
		alert("社員が選択されていません。");
		return false;
	}

	// ▼ 対象の input を取得
	var password = detailForm.querySelector("input[name$='.password']");
	var employeeName = detailForm.querySelector("input[name$='.employeeName']");
	var employeeNameKana = detailForm.querySelector("input[name$='.employeeNameKana']");

	// ▼ 背景をリセット
	password.style.backgroundColor = 'white';
	employeeName.style.backgroundColor = 'white';
	employeeNameKana.style.backgroundColor = 'white';

	// ▼ エラーメッセージ
	let passwordErrorMsg = "";
	let employeeNameErrorMsg = "";
	let employeeNameKanaErrorMsg = "";

	// ▼ パスワード必須
	if (!checkRequired(password.value)) {
		password.style.backgroundColor = 'red';
		passwordErrorMsg = getMessage('E-MSG-000001', ['パスワード']);
	}

	// ▼ 社員名必須
	if (!checkRequired(employeeName.value)) {
		employeeName.style.backgroundColor = 'red';
		employeeNameErrorMsg = getMessage('E-MSG-000001', ['社員名']);
	}

	// ▼ 社員名カナ必須
	if (!checkRequired(employeeNameKana.value)) {
		employeeNameKana.style.backgroundColor = 'red';
		employeeNameKanaErrorMsg = getMessage('E-MSG-000001', ['社員名カナ']);
	} else if (!checkHalfWidthKana(employeeNameKana.value)) {
		employeeNameKana.style.backgroundColor = 'red';
		employeeNameKanaErrorMsg = getMessage('E-MSG-000003', ['社員名カナ']);
	}

	// ▼ エラーをまとめる
	let errorMsg = passwordErrorMsg + employeeNameErrorMsg + employeeNameKanaErrorMsg;

	// ▼ エラーがあれば alert
	if (errorMsg) {
		alert(errorMsg);
		return false;
	}

	// ▼ エラーなし → submit
	document.getElementById('mntform').submit();
	return true;
}

function employeeMstMntRegister() {

  // ▼ フォーム取得
  const form = document.getElementById("registForm");
  if (!form) return false;

  // ▼ input取得
  const password = form.querySelector("input[name='password']");
  const employeeName = form.querySelector("input[name='employeeName']");
  const employeeNameKana = form.querySelector("input[name='employeeNameKana']");

  // ▼ 背景をリセット
  password.style.backgroundColor = 'white';
  employeeName.style.backgroundColor = 'white';
  employeeNameKana.style.backgroundColor = 'white';

  // ▼ エラーメッセージ
  let passwordErrorMsg = "";
  let employeeNameErrorMsg = "";
  let employeeNameKanaErrorMsg = "";

  // ▼ パスワード必須
  if (!checkRequired(password.value)) {
    password.style.backgroundColor = 'red';
    passwordErrorMsg = getMessage('E-MSG-000001', ['パスワード']);
  }

  // ▼ 社員名必須
  if (!checkRequired(employeeName.value)) {
    employeeName.style.backgroundColor = 'red';
    employeeNameErrorMsg = getMessage('E-MSG-000001', ['社員名']);
  }

  // ▼ 社員名カナ必須
  if (!checkRequired(employeeNameKana.value)) {
    employeeNameKana.style.backgroundColor = 'red';
    employeeNameKanaErrorMsg = getMessage('E-MSG-000001', ['社員名カナ']);
  } else if (!checkHalfWidthKana(employeeNameKana.value)) {
    employeeNameKana.style.backgroundColor = 'red';
    employeeNameKanaErrorMsg = getMessage('E-MSG-000003', ['社員名カナ']);
  }

  // ▼ エラーをまとめる
  const errorMsg =
    passwordErrorMsg +
    employeeNameErrorMsg +
    employeeNameKanaErrorMsg;

  // ▼ エラーがあれば alert
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }

  // ★ 参戦演出表示
    document.getElementById("entryOverlay").classList.add("show");

    // ★ 数秒後に一覧画面へ
    setTimeout(() => {
      form.submit();
    }, 2500);

    return false; // 即submitしない
}


document.addEventListener("mousemove", (e) => {
	const cursor = document.getElementById("fakeCursor");
	cursor.style.left = e.clientX + "px";
	cursor.style.top = e.clientY + "px";
});



