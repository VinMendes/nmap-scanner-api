document.addEventListener("DOMContentLoaded", () => {

  console.log("🚀 Nova Varredura iniciada");

  // ===============================
  // ELEMENTOS DO HTML
  // ===============================
  const form = document.getElementById("scan-form");

  const inputNome = document.getElementById("scan-name");
  const inputTarget = document.getElementById("scan-target");

  const optHosts = document.getElementById("hosts");
  const optPorts = document.getElementById("ports");
  const optServices = document.getElementById("services");
  const optHostname = document.getElementById("hostname");

  // ===============================
  // EVENTO DE SUBMIT
  // ===============================
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      console.log("📤 Enviando nova varredura...");

      const payload = montarPayload();

      console.log("📦 Payload:", payload);

      enviarScan(payload);
    });
  }

  // ===============================
  // FUNÇÃO: MONTAR PAYLOAD
  // ===============================
  function montarPayload() {

    return {
      name: inputNome?.value || "",
      target: inputTarget?.value || "",
      options: {
        hosts: optHosts?.checked || false,
        ports: optPorts?.checked || false,
        services: optServices?.checked || false,
        hostname: optHostname?.checked || false
      }
    };
  }

  // ===============================
  // FUNÇÃO: ENVIAR PARA API
  // ===============================
  function enviarScan(payload) {

    fetch("http://localhost:8000/api/scans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao enviar varredura");
        }
        return response.json();
      })
      .then(data => {

        console.log("✅ Scan criado:", data);

        // Feedback visual
        alert("Varredura iniciada com sucesso!");

        // ===============================
        // REDIRECIONAMENTO (IMPORTANTE)
        // ===============================
        // aqui você pode mandar pro resultado ou dashboard
        window.location.href = "resultadoScan.html";

      })
      .catch(error => {
        console.error("❌ Erro:", error);
        alert("Erro ao iniciar varredura");
      });
  }

});