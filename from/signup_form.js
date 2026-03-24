document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const inputs = form.querySelectorAll("input");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");
  const interestField = document.getElementById("interests");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const terms = document.getElementById("terms");

  // === localStorage 恢復 + blur 驗證 ===
  inputs.forEach((input) => {
    const saved = localStorage.getItem(input.id);
    if (saved) input.value = saved;

    input.addEventListener("input", () => {
      localStorage.setItem(input.id, input.value);
    });

    // ✅ blur 後顯示錯誤訊息
    input.addEventListener("blur", () => validateField(input));
  });

  // === 儲存與恢復興趣選項 ===
  interestField.addEventListener("change", () => {
    const selected = [...interestField.querySelectorAll("input:checked")].map(i => i.value);
    localStorage.setItem("interests", JSON.stringify(selected));

    const checked = interestField.querySelectorAll("input:checked");
    const error = document.getElementById("interestError");
    error.textContent = checked.length === 0 ? "請至少選擇一項興趣" : "";
  });

  const savedInterests = JSON.parse(localStorage.getItem("interests") || "[]");
  interestField.querySelectorAll("input").forEach(i => {
    i.checked = savedInterests.includes(i.value);
  });

  // === 儲存與恢復服務條款勾選 ===
  const savedTerms = localStorage.getItem("termsChecked") === "true";
  terms.checked = savedTerms;
  terms.addEventListener("change", (e) => {
    localStorage.setItem("termsChecked", e.target.checked);
  });

  // === 密碼強度條 ===
  const checkStrength = (value) => {
    let score = 0;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    if (value.length >= 8) score++;

    const levels = ["弱", "中", "強", "非常強"];
    const colors = ["#e74c3c", "#f39c12", "#27ae60", "#2ecc71"];
    const index = Math.min(score - 1, 3);
    strengthBar.style.width = `${score * 20}%`;
    strengthBar.style.background = colors[index] || "#ccc";
    strengthText.textContent = `密碼強度：${levels[index] || "無"}`;
  };

  // === 即時驗證 ===
  form.addEventListener("input", (e) => {
    if (e.target.id === "password") {
      checkStrength(e.target.value);
      if (confirmInput.value) validateField(confirmInput);
    }
    validateField(e.target);
  });

  confirmInput.addEventListener("input", () => validateField(confirmInput));

  // === 驗證欄位 ===
  function validateField(field) {
    const errorMsg = document.getElementById(field.id + "Error");
    if (!errorMsg) return;
    let message = "";

    if (field.validity.valueMissing) {
      message = "此欄位為必填";
    } else if (field.type === "email" && field.validity.typeMismatch) {
      message = "請輸入有效的 Email 格式";
    } else if (field.id === "phone" && !/^\d{10}$/.test(field.value)) {
      message = "手機號碼需為 10 位數字";
    } else if (field.id === "password" && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(field.value)) {
      message = "密碼需至少 8 碼，且包含英文字母與數字";
    } else if (field.id === "confirmPassword") {
      const pw = passwordInput.value;
      if (field.value && field.value !== pw) {
        message = "兩次密碼不一致，請再次確認";
      }
    }

    // ✅ 使用 Constraint Validation API
    field.setCustomValidity(message);
    errorMsg.textContent = message;
  }

  // === 表單送出（模擬） ===
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formMessage.textContent = "";

    // 驗證興趣
    const interestsChecked = interestField.querySelectorAll("input:checked");
    const interestError = document.getElementById("interestError");
    if (interestsChecked.length === 0) {
      interestError.textContent = "請至少選擇一項興趣";
    } else {
      interestError.textContent = "";
    }

    // 驗證所有欄位
    let invalid = false;
    let firstInvalid = null;

    inputs.forEach((input) => {
      validateField(input);
      const err = document.getElementById(input.id + "Error");
      if (err && err.textContent !== "") {
        invalid = true;
        if (!firstInvalid) firstInvalid = input; // ✅ 聚焦第一個錯誤
      }
    });

    // 驗證服務條款
    const termsError = document.getElementById("termsError");
    if (!terms.checked) {
      termsError.textContent = "必須同意服務條款";
      invalid = true;
      if (!firstInvalid) firstInvalid = terms;
    } else {
      termsError.textContent = "";
    }

    if (invalid) {
      if (firstInvalid) firstInvalid.focus();
      return; // 有錯誤就不送出
    }

    // === 模擬送出 ===
    submitBtn.disabled = true;
    submitBtn.textContent = "Loading...";

    setTimeout(() => {
      formMessage.textContent = "✅ 註冊成功！";
      formMessage.style.color = "#27ae60"; // 顯示綠色成功字樣
      submitBtn.disabled = false;
      submitBtn.textContent = "送出";
      form.reset();
      strengthBar.style.width = "0";
      strengthText.textContent = "密碼強度：";
      localStorage.clear();
      document.querySelectorAll(".error-msg").forEach((e) => (e.textContent = ""));
    }, 1000);
  });

  // === 重設 ===
  document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    form.querySelectorAll(".error-msg").forEach((p) => (p.textContent = ""));
    formMessage.textContent = "";
    strengthBar.style.width = "0";
    strengthText.textContent = "密碼強度：";
    localStorage.clear();
  });
});
