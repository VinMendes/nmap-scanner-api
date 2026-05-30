document.addEventListener("DOMContentLoaded", () => {

  console.log("🚀 Dashboard iniciado");

  // ===============================
  // ELEMENTOS DO HTML
  // ===============================
  const tableBody = document.querySelector(".history-table tbody");

  const hostsCount = document.getElementById("hosts-count");
  const newHosts = document.getElementById("new-hosts");
  const portsCount = document.getElementById("ports-count");
  const alertsCount = document.getElementById("alerts-count");
  const lastScan = document.getElementById("last-scan");

  // ===============================
  // BUSCAR DADOS DA API
  // ===============================
  fetch("http://127.0.0.1:8000/api/scans")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao acessar API");
      }
      return response.json();
    })
    .then(data => {

      console.log("📡 Dados recebidos:", data);

      // Garante que é array
      const scans = Array.isArray(data) ? data : data.results || [];

      if (!scans.length) {
        console.warn("⚠️ API retornou vazio");
        return;
      }

      // ===============================
      // ATUALIZAR CARDS
      // ===============================
      atualizarCards(scans);

      // ===============================
      // ATUALIZAR TABELA
      // ===============================
      preencherTabela(scans);

    })
    .catch(error => {
      console.error("❌ Erro ao buscar dados:", error);
    });

  // ===============================
  // FUNÇÃO: ATUALIZAR CARDS
  // ===============================
  function atualizarCards(scans) {

    // Total de registros
    if (hostsCount) {
      hostsCount.textContent = scans.length;
    }

    // Novos (últimos 3 como exemplo)
    if (newHosts) {
      newHosts.textContent = scans.slice(0, 3).length;
    }

    // Portas (se existir campo real, substitui depois)
    if (portsCount) {
      portsCount.textContent = scans.length * 2;
    }

    // Alertas (baseado em status)
    if (alertsCount) {
      const totalAlertas = scans.filter(item =>
        item.status === "alert" ||
        item.status === "critical"
      ).length;

      alertsCount.textContent = totalAlertas;
    }

    // Último scan
    if (lastScan) {
      const ultimo = scans[0];

      lastScan.textContent =
        formatarData(
          ultimo.timestamp ||
          ultimo.created_at ||
          ultimo.date
        ) || "--";
    }
  }

  // ===============================
  // FUNÇÃO: PREENCHER TABELA
  // ===============================
  function preencherTabela(scans) {

    if (!tableBody) return;

    tableBody.innerHTML = "";

    scans.forEach(item => {

      // 🔎 tenta encontrar os campos certos
      const evento =
        item.evento ||
        item.status ||
        item.type ||
        "Scan";

      const ip =
        item.ip ||
        item.ip_address ||
        item.host ||
        "N/A";

      const dataHora =
        item.timestamp ||
        item.created_at ||
        item.date ||
        "N/A";

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${evento}</td>
        <td>${ip}</td>
        <td>${formatarData(dataHora)}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  // ===============================
  // FUNÇÃO: FORMATAR DATA
  // ===============================
  function formatarData(valor) {
    if (!valor) return "--";

    try {
      const data = new Date(valor);
      return data.toLocaleString("pt-BR");
    } catch {
      return valor;
    }
  }

});