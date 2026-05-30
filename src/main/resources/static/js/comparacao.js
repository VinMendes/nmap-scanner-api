let targetSelecionado = null;
let scansDoTarget = [];

async function carregarTargets() {
  const targetsContainer = document.getElementById("targetsContainer");

  limparSelecaoScans();

  targetsContainer.innerHTML = `
    <div class="loading-box">
      Carregando targets...
    </div>
  `;

  try {
    const response = await fetch("/api/scans/targets");

    if (!response.ok) {
      throw new Error("Erro ao buscar targets. Status: " + response.status);
    }

    const targets = await response.json();

    renderizarTargets(targets);

  } catch (error) {
    targetsContainer.innerHTML = `
      <div class="error-box">
        ${error.message}
      </div>
    `;
  }
}

function renderizarTargets(targets) {
  const targetsContainer = document.getElementById("targetsContainer");

  targetsContainer.innerHTML = "";

  if (!targets || targets.length === 0) {
    targetsContainer.innerHTML = `
      <div class="empty-box">
        Nenhum target encontrado. Execute uma nova varredura primeiro.
      </div>
    `;

    return;
  }

  targets.forEach(target => {
    const item = document.createElement("div");

    item.className = "target-item";
    item.dataset.target = target;

    item.innerHTML = `
      <div class="target-info">
        <span class="material-symbols-outlined">lan</span>

        <div>
          <div class="target-name">${target}</div>
          <span class="target-muted">Clique para carregar os scans deste target</span>
        </div>
      </div>

      <button class="button button-primary" type="button">
        Selecionar
      </button>
    `;

    item.addEventListener("click", () => {
      selecionarTarget(target);
    });

    targetsContainer.appendChild(item);
  });
}

async function selecionarTarget(target) {
  targetSelecionado = target;

  marcarTargetAtivo(target);
  limparSelecaoScans(false);

  const scansCard = document.getElementById("scansCard");
  const selectedTargetText = document.getElementById("selectedTargetText");
  const scansResumo = document.getElementById("scansResumo");

  scansCard.classList.remove("disabled-card");
  selectedTargetText.textContent = `Target selecionado: ${target}`;

  scansResumo.innerHTML = `
    Carregando scans de <strong class="mono">${target}</strong>...
  `;

  try {
    const response = await fetch(
        `/api/scans/by-target?target=${encodeURIComponent(target)}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar scans do target. Status: " + response.status);
    }

    const scans = await response.json();

    scansDoTarget = Array.isArray(scans) ? scans : [];

    preencherSelectsDeScans(scansDoTarget);
    renderizarResumoScans(scansDoTarget);

  } catch (error) {
    scansResumo.innerHTML = `
      <div class="error-box">
        ${error.message}
      </div>
    `;
  }
}

function marcarTargetAtivo(target) {
  const items = document.querySelectorAll(".target-item");

  items.forEach(item => {
    if (item.dataset.target === target) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function preencherSelectsDeScans(scans) {
  const scanBase = document.getElementById("scanBase");
  const scanNovo = document.getElementById("scanNovo");

  scanBase.innerHTML = `<option value="">Selecione o scan base</option>`;
  scanNovo.innerHTML = `<option value="">Selecione o scan novo</option>`;

  if (!scans || scans.length < 2) {
    scanBase.disabled = true;
    scanNovo.disabled = true;

    document.getElementById("btnComparar").disabled = true;
    return;
  }

  scans.forEach((scan, index) => {
    const optionLabel = montarLabelScan(scan, index);

    const optionBase = document.createElement("option");
    optionBase.value = scan.id;
    optionBase.textContent = optionLabel;

    const optionNovo = document.createElement("option");
    optionNovo.value = scan.id;
    optionNovo.textContent = optionLabel;

    scanBase.appendChild(optionBase);
    scanNovo.appendChild(optionNovo);
  });

  scanBase.disabled = false;
  scanNovo.disabled = false;

  scanBase.onchange = atualizarBotaoComparar;
  scanNovo.onchange = atualizarBotaoComparar;
}

function montarLabelScan(scan, index) {
  const data = formatarData(scan.scanDate || scan.data_scan || scan.createdAt);
  const hosts = scan.hosts || [];
  const portasAbertas = contarPortasAbertas(scan);

  return `Scan ${index + 1} - ${data} - ${hosts.length} host(s) - ${portasAbertas} porta(s) aberta(s)`;
}

function renderizarResumoScans(scans) {
  const scansResumo = document.getElementById("scansResumo");

  if (!scans || scans.length === 0) {
    scansResumo.innerHTML = `
      Nenhum scan encontrado para esse target.
    `;

    return;
  }

  if (scans.length === 1) {
    scansResumo.innerHTML = `
      Foi encontrado apenas <strong>1 scan</strong> para esse target.
      Para comparar, execute pelo menos duas varreduras da mesma rede.
    `;

    return;
  }

  const maisRecente = scans[0];
  const maisAntigo = scans[scans.length - 1];

  scansResumo.innerHTML = `
    <div class="scan-preview-grid">
      <div class="scan-preview">
        <strong>Scan mais recente</strong>
        <p class="mono">${formatarData(maisRecente.scanDate || maisRecente.data_scan || maisRecente.createdAt)}</p>
        <p>${(maisRecente.hosts || []).length} host(s), ${contarPortasAbertas(maisRecente)} porta(s) aberta(s)</p>
      </div>

      <div class="scan-preview">
        <strong>Scan mais antigo</strong>
        <p class="mono">${formatarData(maisAntigo.scanDate || maisAntigo.data_scan || maisAntigo.createdAt)}</p>
        <p>${(maisAntigo.hosts || []).length} host(s), ${contarPortasAbertas(maisAntigo)} porta(s) aberta(s)</p>
      </div>
    </div>
  `;
}

function atualizarBotaoComparar() {
  const scanBase = document.getElementById("scanBase").value;
  const scanNovo = document.getElementById("scanNovo").value;
  const btnComparar = document.getElementById("btnComparar");

  if (!scanBase || !scanNovo) {
    btnComparar.disabled = true;
    return;
  }

  if (scanBase === scanNovo) {
    btnComparar.disabled = true;
    return;
  }

  btnComparar.disabled = false;
}

async function compararScans() {
  const baseScanId = document.getElementById("scanBase").value;
  const newScanId = document.getElementById("scanNovo").value;

  if (!baseScanId || !newScanId || baseScanId === newScanId) {
    return;
  }

  const resultadoCard = document.getElementById("resultadoComparacaoCard");
  const resultado = document.getElementById("resultadoComparacao");
  const resultadoSubtitulo = document.getElementById("resultadoSubtitulo");
  const btnComparar = document.getElementById("btnComparar");

  resultadoCard.classList.remove("hidden");

  resultadoSubtitulo.textContent = "Comparando scans selecionados...";

  resultado.innerHTML = `
    <div class="loading-box">
      Comparando scans...
    </div>
  `;

  btnComparar.disabled = true;

  try {
    const response = await fetch("/api/scans/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        baseScanId: baseScanId,
        newScanId: newScanId
      })
    });

    if (!response.ok) {
      throw new Error("Erro ao comparar scans. Status: " + response.status);
    }

    const comparacao = await response.json();

    resultadoSubtitulo.textContent = `Resultado para o target ${comparacao.target || targetSelecionado || "-"}`;

    renderizarResultadoComparacao(comparacao);

  } catch (error) {
    resultado.innerHTML = `
      <div class="error-box">
        ${error.message}
      </div>
    `;
  } finally {
    atualizarBotaoComparar();
  }
}

function renderizarResultadoComparacao(comparacao) {
  const resultado = document.getElementById("resultadoComparacao");

  const summary = comparacao.summary || {};

  resultado.innerHTML = `
    ${renderizarMetadadosComparacao(comparacao)}
    ${renderizarResumoComparacao(summary)}
    ${renderizarSecaoHosts("Hosts novos", comparacao.newHosts || [], "new")}
    ${renderizarSecaoHosts("Hosts removidos", comparacao.removedHosts || [], "removed")}
    ${renderizarHostDifferences(comparacao.hostDifferences || [])}
    ${renderizarMensagemSemDiferencas(comparacao)}
  `;
}

function renderizarMetadadosComparacao(comparacao) {
  return `
    <div class="comparison-meta">
      <div class="meta-item">
        <span>Target</span>
        <strong>${comparacao.target || "-"}</strong>
      </div>

      <div class="meta-item">
        <span>Scan base</span>
        <strong>${formatarData(comparacao.baseScanDate)}</strong>
      </div>

      <div class="meta-item">
        <span>Scan novo</span>
        <strong>${formatarData(comparacao.newScanDate)}</strong>
      </div>
    </div>
  `;
}

function renderizarResumoComparacao(summary) {
  return `
    <div class="comparison-summary">
      <div class="summary-card success">
        <p>Hosts novos</p>
        <strong>${summary.newHosts ?? 0}</strong>
      </div>

      <div class="summary-card danger">
        <p>Hosts removidos</p>
        <strong>${summary.removedHosts ?? 0}</strong>
      </div>

      <div class="summary-card warning">
        <p>Hosts alterados</p>
        <strong>${summary.changedHosts ?? 0}</strong>
      </div>

      <div class="summary-card success">
        <p>Portas abertas</p>
        <strong>${summary.openedPorts ?? 0}</strong>
      </div>

      <div class="summary-card danger">
        <p>Portas fechadas</p>
        <strong>${summary.closedPorts ?? 0}</strong>
      </div>

      <div class="summary-card warning">
        <p>Portas alteradas</p>
        <strong>${summary.changedPorts ?? 0}</strong>
      </div>
    </div>
  `;
}

function renderizarSecaoHosts(titulo, hosts, tipo) {
  if (!hosts || hosts.length === 0) {
    return "";
  }

  return `
    <section class="diff-section">
      <div class="diff-section-header">
        <h4>${titulo}</h4>
        <span>${hosts.length} encontrado(s)</span>
      </div>

      <div class="diff-list">
        ${hosts.map(host => renderizarHostCard(host, tipo)).join("")}
      </div>
    </section>
  `;
}

function renderizarHostCard(host, tipo) {
  const ip = host.ip || "IP não informado";
  const status = host.status || "unknown";
  const ports = host.ports || host.portas || [];

  const badgeLabel = tipo === "new" ? "novo" : tipo === "removed" ? "removido" : status;
  const badgeClass = tipo === "new" ? "new" : tipo === "removed" ? "removed" : status;

  return `
    <article class="host-diff-card">
      <div class="host-title">
        <strong>${ip}</strong>

        <span class="status-badge ${badgeClass}">
          ${badgeLabel}
        </span>
      </div>

      ${renderizarTabelaPortas(ports)}
    </article>
  `;
}

function renderizarTabelaPortas(ports) {
  if (!ports || ports.length === 0) {
    return `
      <p class="no-ports">
        Nenhuma porta registrada para este host.
      </p>
    `;
  }

  return `
    <div class="ports-table-wrapper">
      <table class="ports-table">
        <thead>
          <tr>
            <th>Porta</th>
            <th>Protocolo</th>
            <th>Estado</th>
            <th>Serviço</th>
            <th>Produto</th>
            <th>Versão</th>
          </tr>
        </thead>

        <tbody>
          ${ports.map(port => `
            <tr>
              <td class="mono">${port.port ?? port.porta ?? "-"}</td>
              <td class="mono">${port.protocol || port.protocolo || "-"}</td>
              <td>
                <span class="status-badge ${port.state || port.estado || "unknown"}">
                  ${port.state || port.estado || "unknown"}
                </span>
              </td>
              <td>${port.service || port.servico || "-"}</td>
              <td>${port.product || port.produto || "-"}</td>
              <td>${port.version || port.versao || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderizarHostDifferences(hostDifferences) {
  if (!hostDifferences || hostDifferences.length === 0) {
    return "";
  }

  return `
    <section class="diff-section">
      <div class="diff-section-header">
        <h4>Hosts com alterações</h4>
        <span>${hostDifferences.length} encontrado(s)</span>
      </div>

      <div class="diff-list">
        ${hostDifferences.map(diff => renderizarHostDifferenceCard(diff)).join("")}
      </div>
    </section>
  `;
}

function renderizarHostDifferenceCard(diff) {
  const ip = diff.ip || diff.hostIp || diff.host || "Host não informado";

  const openedPorts = diff.openedPorts || diff.newOpenPorts || [];
  const closedPorts = diff.closedPorts || diff.removedPorts || [];
  const changedPorts = diff.changedPorts || diff.portDifferences || [];

  return `
    <article class="host-diff-card">
      <div class="host-title">
        <strong>${ip}</strong>

        <span class="status-badge warning">
          alterado
        </span>
      </div>

      ${renderizarSubSecaoPortas("Portas abertas", openedPorts, "open")}
      ${renderizarSubSecaoPortas("Portas fechadas", closedPorts, "closed")}
      ${renderizarSubSecaoPortas("Portas alteradas", changedPorts, "filtered")}
    </article>
  `;
}

function renderizarSubSecaoPortas(titulo, ports, tipo) {
  if (!ports || ports.length === 0) {
    return "";
  }

  return `
    <div class="diff-subsection">
      <h5>${titulo}</h5>
      ${renderizarTabelaPortas(ports)}
    </div>
  `;
}

function renderizarMensagemSemDiferencas(comparacao) {
  const summary = comparacao.summary || {};

  const total =
      (summary.newHosts ?? 0) +
      (summary.removedHosts ?? 0) +
      (summary.changedHosts ?? 0) +
      (summary.openedPorts ?? 0) +
      (summary.closedPorts ?? 0) +
      (summary.changedPorts ?? 0);

  if (total > 0) {
    return "";
  }

  return `
    <div class="no-diff">
      <span class="material-symbols-outlined">check_circle</span>
      Nenhuma diferença encontrada entre os scans selecionados.
    </div>
  `;
}

function limparSelecaoScans(limparTargetAtivo = true) {
  scansDoTarget = [];

  const scansCard = document.getElementById("scansCard");
  const selectedTargetText = document.getElementById("selectedTargetText");
  const scanBase = document.getElementById("scanBase");
  const scanNovo = document.getElementById("scanNovo");
  const scansResumo = document.getElementById("scansResumo");
  const btnComparar = document.getElementById("btnComparar");
  const resultadoCard = document.getElementById("resultadoComparacaoCard");

  if (limparTargetAtivo) {
    targetSelecionado = null;

    document.querySelectorAll(".target-item").forEach(item => {
      item.classList.remove("active");
    });
  }

  if (scansCard) {
    scansCard.classList.add("disabled-card");
  }

  if (selectedTargetText) {
    selectedTargetText.textContent = "Selecione um target primeiro.";
  }

  if (scanBase) {
    scanBase.innerHTML = `<option value="">Selecione o scan base</option>`;
    scanBase.disabled = true;
  }

  if (scanNovo) {
    scanNovo.innerHTML = `<option value="">Selecione o scan novo</option>`;
    scanNovo.disabled = true;
  }

  if (scansResumo) {
    scansResumo.textContent = "Nenhum target selecionado.";
  }

  if (btnComparar) {
    btnComparar.disabled = true;
  }

  if (resultadoCard) {
    resultadoCard.classList.add("hidden");
  }
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

function formatarData(dataISO) {
  if (!dataISO) {
    return "Data não informada";
  }

  return new Date(dataISO).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  });
}

document.addEventListener("DOMContentLoaded", carregarTargets);