# Gabriel Waltrich — Portfolio

Portfolio pessoal desenvolvido como um projeto prático de estudos em **Cloud, Linux, Docker, Nginx, CI/CD e automação**.

Além de apresentar meus projetos e links profissionais, este site também funciona como um laboratório real de infraestrutura, hospedado em uma máquina virtual na Oracle Cloud.

---

## 🚀 Sobre o projeto

O objetivo deste projeto é reunir duas coisas:

- apresentar meu perfil profissional;
- aplicar na prática conceitos de infraestrutura e DevOps.

O site é servido por um container Docker utilizando Nginx e está hospedado diretamente em uma VM na Oracle Cloud.

A aplicação também consome dados públicos da API do GitHub para exibir automaticamente:

- repositórios públicos;
- quantidade de seguidores;
- projetos atualizados recentemente;
- atividades públicas recentes.

---

## 🧱 Arquitetura

```text
Usuário
   │
   ▼
gabrielwaltrich.dev
   │
   ▼
DNS - Name.com
   │
   ▼
Oracle Cloud VM
Ubuntu Linux
   │
   ▼
Docker
   │
   ▼
Nginx
   │
   ▼
Portfolio HTML / CSS / JavaScript
