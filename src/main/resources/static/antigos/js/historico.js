async function carregarScans() {

    try {

        const response =
            await fetch("http://localhost:8000/api/scans");

        const scans =
            await response.json();

        renderizarResumo(scans);

        renderizarScans(scans);

    } catch (error) {

        document.getElementById(
            "scanContainer"
        ).innerHTML = `
      <div class="scan-card">

        <h2>
          Erro ao carregar scans
        </h2>

        <p class="empty">
          ${error.message}
        </p>

      </div>
    `;
    }
}

function renderizarResumo(scans) {

    let totalHosts = 0;
    let openPorts = 0;
    let filteredPorts = 0;

    scans.forEach(scan => {

        const hosts =
            scan.hosts || [];

        totalHosts += hosts.length;

        hosts.forEach(host => {

            const ports =
                host.ports || [];

            ports.forEach(port => {

                if (port.state === "open") {
                    openPorts++;
                }

                if (port.state === "filtered") {
                    filteredPorts++;
                }
            });
        });
    });

    document.getElementById(
        "totalScans"
    ).textContent = scans.length;

    document.getElementById(
        "totalHosts"
    ).textContent = totalHosts;

    document.getElementById(
        "openPorts"
    ).textContent = openPorts;

    document.getElementById(
        "filteredPorts"
    ).textContent = filteredPorts;
}

function renderizarScans(scans) {

    const container =
        document.getElementById("scanContainer");

    container.innerHTML = "";

    scans.forEach(scan => {

        const card =
            document.createElement("div");

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

        const hosts =
            scan.hosts || [];

        hosts.forEach(host => {

            const hostBlock =
                document.createElement("div");

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
    });
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

carregarScans();