let ultimoScanCarregado = null;

async function carregarTelaInicial() {
  const ultimoScanData = document.getElementById("ultimoScanData");
  const hostsEncontrados = document.getElementById("hostsEncontrados");
  const portasAbertas = document.getElementById("portasAbertas");
  const statusRede = document.getElementById("statusRede");
  const ultimoScanContainer = document.getElementById("ultimoScanContainer");
  const scanTargetBadge = document.getElementById("scanTargetBadge");

  ultimoScanData.textContent = "Carregando...";
  hostsEncontrados.textContent = "0";
  portasAbertas.textContent = "0";
  statusRede.textContent = "Carregando";
  scanTargetBadge.textContent = "Target não carregado";

  ultimoScanContainer.innerHTML = `
    <div class="change-item">
      <div class="change-info">
        <span class="material-symbols-outlined change-icon muted">hourglass_empty</span>
        <strong>Carregando dados do último scan...</strong>
      </div>
    </div>
  `;

  try {
    const response = await fetch("/api/scans/latest");

    if (!response.ok) {
      if (response.status === 404) {
        mostrarSemScans();
        return;
      }

      throw new Error("Erro ao buscar último scan. Status: " + response.status);
    }

    const scan = await response.json();

    ultimoScanCarregado = scan;

    const hosts = scan.hosts || [];
    const totalHosts = hosts.length;
    const totalPortasAbertas = contarPortasAbertas(scan);

    ultimoScanData.textContent = formatarData(scan.scanDate || scan.data_scan || scan.createdAt);
    hostsEncontrados.textContent = totalHosts;
    portasAbertas.textContent = totalPortasAbertas;
    scanTargetBadge.textContent = scan.target || scan.alvo || "Target não informado";

    atualizarStatusRede(totalHosts, totalPortasAbertas);
    renderizarResumoUltimoScan(scan);

  } catch (error) {
    ultimoScanCarregado = null;

    ultimoScanData.textContent = "Erro";
    hostsEncontrados.textContent = "0";
    portasAbertas.textContent = "0";
    scanTargetBadge.textContent = "Erro ao carregar";

    statusRede.textContent = "Erro";
    statusRede.classList.remove("success", "warning");
    statusRede.classList.add("danger");

    ultimoScanContainer.innerHTML = `
      <div class="change-item">
        <div class="change-info">
          <span class="material-symbols-outlined change-icon danger">error</span>
          <strong>Erro ao carregar dados:</strong>
          <span>${error.message}</span>
        </div>
      </div>
    `;
  }
}

function atualizarStatusRede(totalHosts, totalPortasAbertas) {
  const statusRede = document.getElementById("statusRede");

  statusRede.classList.remove("success", "warning", "danger");

  if (totalHosts === 0) {
    statusRede.textContent = "Sem hosts";
    statusRede.classList.add("warning");
    return;
  }

  if (totalPortasAbertas === 0) {
    statusRede.textContent = "Sem portas abertas";
    statusRede.classList.add("success");
    return;
  }

  statusRede.textContent = "Operacional";
  statusRede.classList.add("success");
}

function renderizarResumoUltimoScan(scan) {
  const container = document.getElementById("ultimoScanContainer");

  const target = scan.target || scan.alvo || "Target não informado";
  const data = formatarData(scan.scanDate || scan.data_scan || scan.createdAt);
  const hosts = scan.hosts || [];

  container.innerHTML = "";

  const headerItem = document.createElement("div");
  headerItem.className = "change-item";

  headerItem.innerHTML = `
    <div class="change-info">
      <span class="material-symbols-outlined change-icon success">radar</span>
      <strong>Target:</strong>
      <span class="mono">${target}</span>
    </div>

    <span class="change-time">
      ${data}
    </span>
  `;

  container.appendChild(headerItem);

  if (hosts.length === 0) {
    const emptyItem = document.createElement("div");
    emptyItem.className = "change-item";

    emptyItem.innerHTML = `
      <div class="change-info">
        <span class="material-symbols-outlined change-icon muted">dns</span>
        <strong>Nenhum host encontrado no último scan.</strong>
      </div>
    `;

    container.appendChild(emptyItem);
    return;
  }

  hosts.forEach(host => {
    renderizarHost(container, host);
  });
}

function renderizarHost(container, host) {
  const ports = host.ports || host.portas || [];

  const portasAbertas = ports.filter(port => {
    const state = port.state || port.estado;
    return state === "open";
  });

  const status = host.status || "unknown";
  const ip = host.ip || "IP não informado";

  const item = document.createElement("div");
  item.className = "change-item host-item";

  item.innerHTML = `
    <div class="change-info">
      <span class="material-symbols-outlined change-icon success">dns</span>

      <strong>Host ativo:</strong>

      <span class="mono">
        ${ip}
      </span>

      <span>
        ${portasAbertas.length} porta(s) aberta(s)
      </span>
    </div>

    <span class="host-status ${status}">
      ${status}
    </span>
  `;

  container.appendChild(item);

  portasAbertas.slice(0, 4).forEach(port => {
    renderizarPorta(container, ip, port);
  });

  if (portasAbertas.length > 4) {
    const maisPortasItem = document.createElement("div");
    maisPortasItem.className = "change-item more-item";

    maisPortasItem.innerHTML = `
      <div class="change-info">
        <span class="material-symbols-outlined change-icon muted">more_horiz</span>
        <strong>Mais portas:</strong>
        <span>${portasAbertas.length - 4} porta(s) adicional(is) neste host.</span>
      </div>
    `;

    container.appendChild(maisPortasItem);
  }
}

function renderizarPorta(container, ip, port) {
  const porta = port.port || port.porta || "-";
  const protocolo = port.protocol || port.protocolo || "tcp";
  const servico = port.service || port.servico || "serviço não identificado";
  const produto = port.product || port.produto || "";
  const versao = port.version || port.versao || "";

  const detalhes = [produto, versao]
      .filter(valor => valor && valor.trim() !== "")
      .join(" ");

  const portaItem = document.createElement("div");
  portaItem.className = "change-item port-item";

  portaItem.innerHTML = `
    <div class="change-info">
      <span class="material-symbols-outlined change-icon danger">door_open</span>

      <strong>Porta aberta:</strong>

      <span class="mono">
        ${ip} → ${porta}/${protocolo}
      </span>

      <span>
        ${servico}
      </span>
    </div>

    <span class="change-time">
      ${detalhes}
    </span>
  `;

  container.appendChild(portaItem);
}

function contarPortasAbertas(scan) {
  let total = 0;

  const hosts = scan.hosts || [];

  hosts.forEach(host => {
    const ports = host.ports || host.portas || [];

    ports.forEach(port => {
      const state = port.state || port.estado;

      if (state === "open") {
        total++;
      }
    });
  });

  return total;
}

function mostrarSemScans() {
  ultimoScanCarregado = null;

  document.getElementById("ultimoScanData").textContent = "Nenhum scan";
  document.getElementById("hostsEncontrados").textContent = "0";
  document.getElementById("portasAbertas").textContent = "0";
  document.getElementById("scanTargetBadge").textContent = "Nenhum target";

  const statusRede = document.getElementById("statusRede");

  statusRede.textContent = "Sem dados";
  statusRede.classList.remove("success", "danger");
  statusRede.classList.add("warning");

  document.getElementById("ultimoScanContainer").innerHTML = `
    <div class="change-item">
      <div class="change-info">
        <span class="material-symbols-outlined change-icon muted">info</span>
        <strong>Nenhuma varredura encontrada.</strong>
        <span>Execute um novo scan para visualizar os dados aqui.</span>
      </div>
    </div>
  `;
}

function configurarBuscaLocal() {
  const input = document.getElementById("home-search");

  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    const termo = input.value.trim().toLowerCase();

    if (!ultimoScanCarregado) {
      return;
    }

    if (!termo) {
      renderizarResumoUltimoScan(ultimoScanCarregado);
      return;
    }

    const scanFiltrado = filtrarScanPorTermo(ultimoScanCarregado, termo);

    renderizarResumoUltimoScan(scanFiltrado);
  });
}

function filtrarScanPorTermo(scan, termo) {
  const hosts = scan.hosts || [];

  const hostsFiltrados = hosts
      .map(host => {
        const ports = host.ports || host.portas || [];

        const ip = host.ip || "";
        const status = host.status || "";

        const portasFiltradas = ports.filter(port => {
          const textoPorta = [
            port.port,
            port.porta,
            port.protocol,
            port.protocolo,
            port.state,
            port.estado,
            port.service,
            port.servico,
            port.product,
            port.produto,
            port.version,
            port.versao
          ].join(" ").toLowerCase();

          return textoPorta.includes(termo);
        });

        const textoHost = `${ip} ${status}`.toLowerCase();

        if (textoHost.includes(termo)) {
          return host;
        }

        if (portasFiltradas.length > 0) {
          return {
            ...host,
            ports: portasFiltradas,
            portas: portasFiltradas
          };
        }

        return null;
      })
      .filter(host => host !== null);

  return {
    ...scan,
    hosts: hostsFiltrados
  };
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
  configurarBuscaLocal();
  carregarTelaInicial();
});