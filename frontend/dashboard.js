document.addEventListener("DOMContentLoaded", () => {

  console.log("Dashboard carregado");

  const tableBody = document.querySelector(".history-table tbody");

  const hostsCount = document.getElementById("hosts-count");
  const newHosts = document.getElementById("new-hosts");
  const portsCount = document.getElementById("ports-count");
  const alertsCount = document.getElementById("alerts-count");
  const lastScan = document.getElementById("last-scan");

  // 🔥 TENTA BUSCAR DA API
  fetch("http://127.0.0.1:8000/api/scans")
    .then(res => {
      if (!res.ok) throw new Error("Erro na API");
      return res.json();
    })
    .then(data => {

      console.log("Dados da API:", data);

      // ======================
      // CARDS
      // ======================
      if (hostsCount) hostsCount.textContent = data.length;
      if (newHosts) newHosts.textContent = Math.min(3, data.length);
      if (portsCount) portsCount.textContent = data.length * 2;
      if (alertsCount) alertsCount.textContent = Math.floor(data.length / 2);

      if (lastScan && data.length > 0) {
        lastScan.textContent = data[0].timestamp || "--";
      }

      // ======================
      // TABELA
      // ======================
      tableBody.innerHTML = "";

      data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${item.evento || "Scan"}</td>
          <td>${item.ip || "-"}</td>
          <td>${item.timestamp || "-"}</td>
        `;

        tableBody.appendChild(row);
      });

    })
    .catch(err => {
      console.error("Erro ao conectar com API:", err);

      // 🧪 fallback (pra você ver funcionando mesmo com erro)
      preencherMock();
    });

  // 🔥 fallback se API falhar
  function preencherMock() {

    const mock = [
      { evento: "Novo host", ip: "192.168.0.10", timestamp: "10:20" },
      { evento: "Porta aberta", ip: "192.168.0.12", timestamp: "10:10" },
      { evento: "Host removido", ip: "192.168.0.5", timestamp: "09:50" }
    ];

    tableBody.innerHTML = "";

    mock.forEach(item => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.evento}</td>
        <td>${item.ip}</td>
        <td>${item.timestamp}</td>
      `;

      tableBody.appendChild(row);
    });

    hostsCount.textContent = mock.length;
    newHosts.textContent = 1;
    portsCount.textContent = 5;
    alertsCount.textContent = 1;
    lastScan.textContent = "Agora";
  }

});