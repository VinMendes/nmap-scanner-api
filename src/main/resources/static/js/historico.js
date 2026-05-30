let scansCarregados = [];

async function carregarScans() {
  const tbody = document.getElementById("historicoBody");
  const historyCount = document.getElementById("history-count");

  tbody.innerHTML = `
    <tr class="loading-row">
      <td colspan="6">
        Carregando histórico de scans...
      </td>
    </tr>
  `;

  historyCount.textContent = "Carregando registros...";

  try {
    const response = await fetch("/api/scans");

    if (!response.ok) {
      throw new Error("Erro ao buscar scans. Status: " + response.status);
    }

    const scans = await response.json();

    scansCarregados = Array.isArray(scans) ? scans : [];

    renderizarResumo(scansCarregados);
    renderizarTabela(scansCarregados);

  } catch (error) {
    tbody.innerHTML = `
      <tr class="error-row">
        <td colspan="6">
          Erro ao carregar histórico: ${error.message}
        </td>
      </tr>
    `;

    historyCount.textContent = "Erro ao carregar registros.";

    zerarResumo();
  }
}

function renderizarResumo(scans) {
  let totalHosts = 0;
  let openPorts = 0;
  let filteredPorts = 0;

  scans.forEach(scan => {
    const hosts = scan.hosts || [];

    totalHosts += hosts.length;

    hosts.forEach(host => {
      const ports = host.ports || host.portas || [];

      ports.forEach(port => {
        const state = port.state || port.estado;

        if (state === "open") {
          openPorts++;
        }

        if (state === "filtered") {
          filteredPorts++;
        }
      });
    });
  });

  document.getElementById("totalScans").textContent = scans.length;
  document.getElementById("totalHosts").textContent = totalHosts;
  document.getElementById("openPorts").textContent = openPorts;
  document.getElementById("filteredPorts").textContent = filteredPorts;
}

function zerarResumo() {
  document.getElementById("totalScans").textContent = "0";
  document.getElementById("totalHosts").textContent = "0";
  document.getElementById("openPorts").textContent = "0";
  document.getElementById("filteredPorts").textContent = "0";
}

function renderizarTabela(scans) {
  const tbody = document.getElementById("historicoBody");
  const historyCount = document.getElementById("history-count");

  tbody.innerHTML = "";

  if (!scans || scans.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-row-visible">
        <td colspan="6">
          Nenhuma varredura encontrada.
        </td>
      </tr>
    `;

    historyCount.textContent = "Mostrando 0 registros";
    return;
  }

  scans.forEach(scan => {
    const tr = document.createElement("tr");

    const target = scan.target || scan.alvo || "Target não informado";
    const data = formatarData(scan.scanDate || scan.data_scan || scan.createdAt);
    const hosts = scan.hosts || [];

    const totalHosts = hosts.length;
    const portasAbertas = contarPortasPorEstado(scan, "open");
    const portasFiltradas = contarPortasPorEstado(scan, "filtered");

    const id = scan.id || "";

    tr.setAttribute(
        "data-search",
        `${target} ${data} ${id} ${extrairIps(scan)}`.toLowerCase()
    );

    tr.innerHTML = `
      <td>
        <div class="scan-name">
          <span class="material-symbols-outlined">dns</span>
          <div>
            <strong>${target}</strong>
            <div class="date">ID: ${id || "sem id"}</div>
          </div>
        </div>
      </td>

      <td class="mono muted">
        ${data}
      </td>

      <td class="text-center">
        <span class="badge badge-info">${totalHosts}</span>
      </td>

      <td class="text-center">
        <span class="badge badge-success">${portasAbertas}</span>
      </td>

      <td class="text-center">
        <span class="badge badge-filtered">${portasFiltradas}</span>
      </td>

      <td class="text-right">
        <button
          class="button button-dark button-small compare-button"
          type="button"
          onclick="irParaComparacao('${id}')"
        >
          <span class="material-symbols-outlined">compare_arrows</span>
          Comparar
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  historyCount.textContent = `Mostrando ${scans.length} registro(s)`;
}

function contarPortasPorEstado(scan, estadoDesejado) {
  let total = 0;

  const hosts = scan.hosts || [];

  hosts.forEach(host => {
    const ports = host.ports || host.portas || [];

    ports.forEach(port => {
      const state = port.state || port.estado;

      if (state === estadoDesejado) {
        total++;
      }
    });
  });

  return total;
}

function extrairIps(scan) {
  const hosts = scan.hosts || [];

  return hosts
      .map(host => host.ip || "")
      .join(" ");
}

function configurarBusca() {
  const input = document.getElementById("historico-search");

  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    const termo = input.value.trim().toLowerCase();

    if (!termo) {
      renderizarTabela(scansCarregados);
      return;
    }

    const scansFiltrados = scansCarregados.filter(scan => {
      const target = scan.target || scan.alvo || "";
      const id = scan.id || "";
      const data = formatarData(scan.scanDate || scan.data_scan || scan.createdAt);
      const ips = extrairIps(scan);

      const texto = `${target} ${id} ${data} ${ips}`.toLowerCase();

      return texto.includes(termo);
    });

    renderizarTabela(scansFiltrados);
  });
}

function irParaComparacao(scanId) {
  if (!scanId) {
    window.location.href = "/pages/comparacao.html";
    return;
  }

  window.location.href = `/pages/comparacao.html?scanId=${scanId}`;
}

function formatarData(dataISO) {
  if (!dataISO) {
    return "Data não informada";
  }

  return new Date(dataISO).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarBusca();
  carregarScans();
});