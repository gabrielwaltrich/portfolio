##Como funciona

CI/CD Pipeline

GitHub
   │
   │ Push to main
   ▼
GitHub Actions
   │
   │ SSH
   ▼
Oracle Cloud
   │
   ├── Git pull/fetch
   │
   ├── Docker build
   │
   ├── Container replacement
   │
   └── Image cleanup
   │
   ▼
Nginx
   │
   ▼
Portfolio
