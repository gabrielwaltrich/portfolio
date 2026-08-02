# Portfolio — Gabriel Waltrich

Portfólio estático, leve e pronto para Nginx/Docker.

## Personalização obrigatória

Abra `script.js` e altere:

```js
const CONFIG = {
  githubUsername: "SEU_USUARIO_GITHUB",
  linkedinUrl: "https://www.linkedin.com/in/SEU_PERFIL/",
  maxProjects: 6,
  maxEvents: 8
};
```

## O que é automático

- quantidade de repositórios públicos;
- seguidores no GitHub;
- repositórios públicos em destaque;
- linguagem, stars, forks e última atualização;
- últimas atividades públicas do GitHub.

## LinkedIn

O LinkedIn não possui uma API pública aberta que permita importar livremente toda a atividade
de qualquer perfil. Por isso, o template usa um botão para o seu perfil. Se quiser, adicione
manualmente uma seção com posts/artigos selecionados.

## Arquivos

- `index.html`
- `style.css`
- `script.js`

Copie os três para a raiz do seu projeto atual e faça novo build do container.

## Deploy

```bash
docker compose up -d --build
```
