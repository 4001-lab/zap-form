// ─── CONFIG (replace with your actual value) ────────────────────────────────
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/<your-hook-id>/";
// ─────────────────────────────────────────────────────────────────────────────

const form      = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const status    = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name:    document.getElementById("name").value.trim(),
    email:   document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  if (!payload.name || !payload.email || !payload.message) {
    setStatus("Please fill in all fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  setStatus("Sending…", "");

  try {
    await triggerZapier(payload);

    setStatus("Message sent! We'll be in touch soon.", "success");
    form.reset();
  } catch (err) {
    console.error(err);
    setStatus("Something went wrong. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

async function triggerZapier(data) {
  const res = await fetch(ZAPIER_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Zapier webhook failed");
}

function setStatus(msg, type) {
  status.textContent = msg;
  status.className = `status ${type}`;
}
