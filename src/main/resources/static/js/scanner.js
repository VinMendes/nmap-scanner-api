async function rodarScan() {

    const targetInput = document.getElementById("target");
    const statusMessage = document.getElementById("statusMessage");
    const resultadoContainer = document.getElementById("resultadoContainer");

    const target = targetInput.value.trim();

    if (!target) {

        statusMessage.textContent =
            "Informe um target antes de rodar o scan.";

        return;
    }

    statusMessage.textContent =
        "Rodando scan... aguarde.";

    resultadoContainer.innerHTML = "";

    try {

        const response = await fetch(
            "http://localhost:8000/api/scans/run",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    target: target
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao rodar scan. Status: " + response.status
            );
        }

        const scan = await response.json();

        statusMessage.textContent =
            "Scan finalizado com sucesso.";

        renderizarScan(scan, resultadoContainer);

    } catch (error) {

        statusMessage.textContent =
            "Erro: " + error.message;
    }
}

function renderizarScan(scan, container) {

    const card = document.createElement("div");

    card.className = "scan-card";

    const target =
        scan.target || "Target não informado";

    const data =
        formatarData(scan.scanDate);

    card.innerHTML = `
    <div class="scan-header">

      <div>
        <div class="target">
          ${target}
        </div>

        <div class="date">
          ID: ${scan.id || "sem id"}
        </div>
      </div>

      <div class="date">
        ${data}
      </div>

    </div>
  `;

    const hosts = scan.hosts || [];

    hosts.forEach(host => {

        const hostBlock = document.createElement("div");

        hostBlock.innerHTML = `
      <div class="ip">

        Host: ${host.ip || "IP não informado"}

        <span class="badge ${host.status || "unknown"}">
          ${host.status || "unknown"}
        </span>

      </div>

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

          ${(host.ports || []).map(port => `

            <tr>

              <td>${port.port ?? "-"}</td>

              <td>${port.protocol || "-"}</td>

              <td>
                <span class="badge ${port.state || "unknown"}">
                  ${port.state || "unknown"}
                </span>
              </td>

              <td>${port.service || "-"}</td>

              <td>${port.product || "-"}</td>

              <td>${port.version || "-"}</td>

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

    return new Date(dataISO).toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "medium"
        }
    );
}