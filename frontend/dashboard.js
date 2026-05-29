document.addEventListener("DOMContentLoaded", () => {

  const tableBody = document.querySelector("tbody");

  const hostsCount = document.getElementById("hosts-count");
  const newHosts = document.getElementById("new-hosts");
  const portsCount = document.getElementById("ports-count");
  const alertsCount = document.getElementById("alerts-count");
  const lastScan = document.getElementById("last-scan");

  // ===============================
  // CARREGAR DADOS DA API
  // ===============================
  function carregarScans() {
    fetch("http://localhost:8000/api/scans")
      .then(response => response.json())
      .then(data => {
        console.log("API:", data);

        renderTable(data);
        atualizarCards(data);
      })
      .catch(error => {
        console.error("Erro:", error);
      });
  }

  // ===============================
  // TABELA
  // ===============================
  function renderTable(data) {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    data.forEach(item => {
      const row = document.createElement("tr");

      const evento = item.evento || "Scan";
      const ip = item.ip || "N/A";
      const dataHora = item.timestamp || "N/A";

      row.innerHTML = `
        <td>${evento}</td>
        <td>${ip}</td>
        <td>${dataHora}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  // ===============================
  // CARDS
  // ===============================
  function atualizarCards(data) {

    if (!data || data.length === 0) return;

    // total hosts (exemplo simples)
    hostsCount.textContent = data.length;

    // novos hosts (exemplo: últimos 3)
    newHosts.textContent = Math.min(3, data.length);

    // portas (mock)
    portsCount.textContent = data.length * 2;

    // alertas (mock)
    alertsCount.textContent = Math.floor(data.length / 2);

    // último scan
    if (lastScan) {
      lastScan.textContent = data[0].timestamp || "--";
    }
  }

  // ===============================
  // INICIALIZAÇÃO
  // ===============================
  carregarScans();
});