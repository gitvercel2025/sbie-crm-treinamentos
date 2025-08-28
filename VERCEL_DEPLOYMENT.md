# SBIE CRM - Vercel Deployment Guide

Este documento descreve como fazer o deploy da aplicação SBIE CRM no Vercel.

## ✅ Configuração Corrigida - Janeiro 2025

A aplicação foi configurada como **SPA (Single Page Application)** pura para o Vercel.

### Arquivos de Configuração

#### `vercel.json` (Atualizado)

```json
{
  "version": 2,
  "buildCommand": "npm run build:client",
  "outputDirectory": "dist/spa",
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/robots.txt",
      "dest": "/robots.txt"
    },
    {
      "src": "/placeholder.svg",
      "dest": "/placeholder.svg"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Scripts de Build

O projeto utiliza:

- `npm run build:client` - Constrói o frontend (SPA)
- Output: `dist/spa/`

### Estrutura de Deploy

```
dist/spa/
├── index.html           # Página principal
├── assets/
│   ├── index-*.js      # Bundle JavaScript
│   └── index-*.css     # Bundle CSS
├── favicon.ico
├── robots.txt
└── placeholder.svg
```

## 🚀 Como Fazer Deploy

### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Importe o projeto `sbie-crm-treinamentos`

### 2. Configuração Automática

O Vercel detectará automaticamente:

- Framework: React/Vite
- Build Command: `npm run build:client`
- Output Directory: `dist/spa`

### 3. Deploy

O deploy acontecerá automaticamente a cada push na branch `main`.

## 🔧 Características da Aplicação

### Frontend SPA

- **React + TypeScript + Vite**
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **localStorage** para persistência de dados

### Funcionalidades

- ✅ Sistema de autenticação (admin/admin)
- ✅ Gestão de alunos
- ✅ Importação CSV
- ✅ Gestão de treinamentos
- ✅ Relatórios e dashboard
- ✅ Persistência local de dados

## 📋 Verificações Pós-Deploy

Após o deploy, verifique:

1. ✅ Aplicação carrega na URL do Vercel
2. ✅ Tela de login aparece primeiro
3. ✅ Login com admin/admin funciona
4. ✅ Navegação entre páginas funciona
5. ✅ Importação CSV funciona
6. ✅ Dados permanecem após refresh

## 🛠️ Resolução de Problemas

### ✅ CORRIGIDO: Página em branco

**Causa:** Configuração incorreta para SPA no `vercel.json`
**Solução:**

- Removida configuração de serverless functions
- Configuradas rotas adequadas para SPA
- Todos os paths redirecionam para `index.html`

### ✅ CORRIGIDO: Rotas 404

**Causa:** React Router precisa que todas as rotas sejam servidas pelo `index.html`
**Solução:** Configuração `"src": "/(.*)", "dest": "/index.html"`

### Logs de Deploy

Para verificar problemas:

1. Acesse Vercel Dashboard
2. Vá em "Functions" ou "Deployments"
3. Verifique logs de build e runtime

## 🎯 Status Atual

**✅ FUNCIONANDO:** A aplicação está configurada corretamente para deploy no Vercel como SPA.

**📝 Para fazer deploy:**

1. Faça push das mudanças para GitHub
2. Vercel automaticamente detectará e fará novo deploy
3. Aplicação estará disponível na URL: `https://sbie-crm-treinamentos.vercel.app`

## 📚 Recursos Adicionais

- [Vercel SPA Documentation](https://vercel.com/guides/deploying-react-with-vercel)
- [React Router + Vercel](https://vercel.com/guides/deploying-react-with-vercel#routing)
- [Vite + Vercel](https://vitejs.dev/guide/static-deploy.html#vercel)

## 🔄 Changelog

### Janeiro 2025

- ✅ Corrigido problema de página em branco
- ✅ Configuração SPA adequada para React Router
- ✅ Removidas configurações desnecessárias de serverless functions
- ✅ Título da aplicação atualizado
- ✅ Build otimizado para produção
