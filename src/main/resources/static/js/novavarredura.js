async function rodarScan() {
  const targetInput = document.getElementById("target");
  const statusMessage = document.getElementById("statusMessage");
  const resultadoContainer = document.getElementById("resultadoContainer");
  const botao = document.querySelector(".btn-primary");

  const target = targetInput.value.trim();

  if (!target) {
    statusMessage.textContent = "Informe um target antes de rodar o scan.";
    return;
  }

  statusMessage.textContent = "Rodando scan... aguarde.";
  resultadoContainer.innerHTML = "";
  botao.disabled = true;

  try {
    const response = await fetch("/api/scans/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target: target
      })
    });

    if (!response.ok) {
      throw new Error("Erro ao rodar scan. Status: " + response.status);
    }

    const scan = await response.json();

    statusMessage.textContent = "Scan finalizado com sucesso.";

    renderizarScan(scan, resultadoContainer);

  } catch (error) {
    statusMessage.textContent = "Erro: " + error.message;

    resultadoContainer.innerHTML = `
      <div class="empty-state">
        <span class="material-symbols-outlined">error</span>
        <p>Não foi possível executar a varredura.</p>
      </div>
    `;

  } finally {
    botao.disabled = false;
  }
}

function renderizarScan(scan, container) {
  const card = document.createElement("div");
  card.className = "scan-card";

  const target = scan.target || scan.alvo || "Target não informado";

  const data = formatarData(
      scan.scanDate || scan.data_scan || scan.createdAt
  );

  card.innerHTML = `
    <div class="scan-header">
      <div>
        <div class="target">${target}</div>
        <div class="date">ID: ${scan.id || "sem id"}</div>
      </div>

      <div class="date">${data}</div>
    </div>
  `;

  const hosts = scan.hosts || [];

  if (hosts.length === 0) {
    card.innerHTML += `
      <div class="empty-state">
        <span class="material-symbols-outlined">dns</span>
        <p>Nenhum host encontrado nesse scan.</p>
      </div>
    `;

    container.appendChild(card);
    return;
  }

  hosts.forEach(host => {
    const hostBlock = document.createElement("div");
    hostBlock.className = "host-block";

    const portas = host.ports || host.portas || [];

    hostBlock.innerHTML = `
      <div class="ip">
        Host: ${host.ip || "IP não informado"}

        <span class="badge ${host.status || "unknown"}">
          ${host.status || "unknown"}
        </span>
      </div>
    `;

    if (portas.length === 0) {
      hostBlock.innerHTML += `
        <div class="no-ports">
          Nenhuma porta encontrada para este host.
        </div>
      `;

      card.appendChild(hostBlock);
      return;
    }

    hostBlock.innerHTML += `
      <table>
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
          ${portas.map(port => `
            <tr>
              <td>${port.port || port.porta || "-"}</td>
              <td>${port.protocol || port.protocolo || "-"}</td>
              <td>
                <span class="badge ${port.state || port.estado || "unknown"}">
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
    `;

    card.appendChild(hostBlock);
  });

  container.appendChild(card);
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