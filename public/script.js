async function kirim() {
  const input = document.getElementById("chatInput");
  const pesan = input.value;
  if (!pesan) return;

  tampilkan("👤 " + pesan);
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: pesan })
  });

  const data = await res.json();
  tampilkan("🤖 " + data.respond);
}

function tampilkan(msg) {
  const box = document.getElementById("chatBox");
  const el = document.createElement("div");
  el.textContent = msg;
  box.appendChild(el);
}
