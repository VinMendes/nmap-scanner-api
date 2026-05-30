const API_BASE_URL = "http://localhost:8000/api/scans";

async function listarScans() {
    const resposta = await fetch(API_BASE_URL);

    if (!resposta.ok) {
        throw new Error("Erro ao listar scans");
    }

    return await resposta.json();
}

async function buscarScanPorId(scanId) {
    const resposta = await fetch(`${API_BASE_URL}/${scanId}`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar resultado da varredura");
    }

    return await resposta.json();
}