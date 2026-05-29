document.addEventListener("DOMContentLoaded", () => {

  const tableBody = document.querySelector("tbody");
  const historyCount = document.getElementById("history-count");

  // ===============================
  // NORMALIZAR TEXTO (igual ao seu)
  // ===============================
  function normalizeText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // ===============================
  // ATUALIZAR CONTADOR
  // ===============================
  function updateVisibleCount(total) {
    if (historyCount) {
      historyCount.textContent = `Mostrando ${total} registros`;
    }
  }

  // ===============================
  // RENDERIZAR TABELA
  // ===============================
  function renderTable(data) {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    data.forEach((item) => {

      const row = document.createElement("tr");

      // 🔥 adapta aqui conforme sua API
      const evento = item.evento || "Scan";
      const ip = item.ip || item.host || "N/A";
      const dataHora = item.data || item.timestamp || "N/A";

      row.innerHTML = `
        <td>${evento}</td>
        <td>${ip}</td>
        <td>${dataHora}</td>
      `;

      // usado no filtro (igual seu padrão)
      row.dataset.search = normalizeText(`${evento} ${ip} ${dataHora}`);

      tableBody.appendChild(row);
    });

    updateVisibleCount(data.length);
  }

  // ===============================
  // BUSCAR DADOS DA API
  // ===============================
  function carregarScans() {
    fetch("http://localhost:8000/api/scans")
      .then((response) => response.json())
      .then((data) => {
        console.log("Scans:", data);

        renderTable(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar scans:", error);
      });
  }

  // ===============================
  // INICIALIZAÇÃO
  // ===============================
  carregarScans();
});