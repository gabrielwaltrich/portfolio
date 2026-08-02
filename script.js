/*
  CONFIGURAÇÃO
  Troque apenas estes dois valores.
*/
const CONFIG = {
  githubUsername: "gabrielwaltrich",
  linkedinUrl: "https://www.linkedin.com/in/gabrielwaltrich/",
  maxProjects: 6,
  maxEvents: 8
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const GITHUB_BASE = "https://api.github.com";

function applyProfileLinks() {
  const githubUrl = `https://github.com/${CONFIG.githubUsername}`;

  $$("[data-github]").forEach((link) => {
    link.href = githubUrl;
  });

  $$("[data-linkedin]").forEach((link) => {
    link.href = CONFIG.linkedinUrl;
  });
}

async function githubFetch(path) {
  const response = await fetch(`${GITHUB_BASE}${path}`, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API respondeu ${response.status}`);
  }

  return response.json();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function relativeTime(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "agora";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} d`;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  }).format(date);
}

function eventDescription(event) {
  const repo = event.repo?.name || "repositório";

  const map = {
    PushEvent: ["push", `Enviou código para ${repo}`],
    CreateEvent: ["create", `Criou algo novo em ${repo}`],
    PullRequestEvent: ["pull request", `Atualizou um pull request em ${repo}`],
    IssuesEvent: ["issue", `Trabalhou em uma issue de ${repo}`],
    ReleaseEvent: ["release", `Publicou uma release em ${repo}`],
    WatchEvent: ["star", `Marcou ${repo} com estrela`],
    ForkEvent: ["fork", `Criou um fork de ${repo}`],
    DeleteEvent: ["delete", `Removeu uma referência em ${repo}`],
    PublicEvent: ["public", `Tornou ${repo} público`]
  };

  return map[event.type] || ["activity", `Atividade pública em ${repo}`];
}

async function loadProfile() {
  const user = await githubFetch(`/users/${encodeURIComponent(CONFIG.githubUsername)}`);

  $("#repo-count").textContent = user.public_repos ?? "—";
  $("#followers-count").textContent = user.followers ?? "—";
}

async function loadProjects() {
  const container = $("#projects-grid");
  const errorBox = $("#projects-error");

  try {
    const repos = await githubFetch(
      `/users/${encodeURIComponent(CONFIG.githubUsername)}/repos?sort=updated&direction=desc&per_page=100`
    );

    const selected = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => {
        if (a.stargazers_count !== b.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, CONFIG.maxProjects);

    if (!selected.length) {
      container.innerHTML = `<p class="inline-message">Nenhum repositório público encontrado.</p>`;
      return;
    }

    container.innerHTML = selected.map((repo) => `
      <a class="project-card" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">
        <div class="project-top">
          <span class="repo-icon">⌘</span>
          ${repo.language ? `<span class="project-language">${escapeHtml(repo.language)}</span>` : ""}
        </div>

        <h3>${escapeHtml(repo.name)}</h3>
        <p class="project-description">
          ${escapeHtml(repo.description || "Projeto público no GitHub.")}
        </p>

        <div class="project-footer">
          <span>Atualizado ${relativeTime(repo.updated_at)}</span>
          <span class="project-stats">
            <span>★ ${repo.stargazers_count}</span>
            <span>⑂ ${repo.forks_count}</span>
          </span>
        </div>
      </a>
    `).join("");
  } catch (error) {
    container.innerHTML = "";
    errorBox.classList.remove("hidden");
    errorBox.textContent =
      "Não foi possível carregar os projetos agora. Confira o usuário configurado ou tente novamente mais tarde.";
    console.error(error);
  }
}

async function loadActivity() {
  const container = $("#activity-list");

  try {
    const events = await githubFetch(
      `/users/${encodeURIComponent(CONFIG.githubUsername)}/events/public?per_page=${CONFIG.maxEvents}`
    );

    if (!events.length) {
      container.innerHTML = `
        <div class="activity-item">
          <div class="activity-main">
            <strong>Nenhuma atividade pública recente.</strong>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = events.map((event) => {
      const [type, description] = eventDescription(event);
      const repoUrl = event.repo?.name
        ? `https://github.com/${event.repo.name}`
        : `https://github.com/${CONFIG.githubUsername}`;

      return `
        <div class="activity-item">
          <span class="activity-type">${escapeHtml(type)}</span>

          <div class="activity-main">
            <strong>${escapeHtml(description)}</strong>
            <span>
              <a href="${escapeHtml(repoUrl)}" target="_blank" rel="noreferrer">
                ${escapeHtml(event.repo?.name || CONFIG.githubUsername)}
              </a>
            </span>
          </div>

          <span class="activity-time">${relativeTime(event.created_at)}</span>
        </div>
      `;
    }).join("");
  } catch (error) {
    container.innerHTML = `
      <div class="activity-item">
        <div class="activity-main">
          <strong>Atividade indisponível no momento.</strong>
          <span>A API pública do GitHub pode estar temporariamente limitada.</span>
        </div>
      </div>
    `;
    console.error(error);
  }
}

async function init() {
  applyProfileLinks();
  $("#year").textContent = new Date().getFullYear();

  if (CONFIG.githubUsername === "SEU_USUARIO_GITHUB") {
    $("#projects-grid").innerHTML = `
      <p class="inline-message">
        Edite <strong>script.js</strong> e coloque seu usuário do GitHub em CONFIG.githubUsername.
      </p>
    `;
    $("#activity-list").innerHTML = `
      <div class="activity-item">
        <div class="activity-main">
          <strong>Configure seu usuário do GitHub.</strong>
          <span>Depois disso, esta área será preenchida automaticamente.</span>
        </div>
      </div>
    `;
    return;
  }

  await Promise.allSettled([
    loadProfile(),
    loadProjects(),
    loadActivity()
  ]);
}

init();
