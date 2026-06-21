@@ -0,0 +1,174 @@
+# 🛒 playVisionSiteVendas
+
+Projeto de e-commerce desenvolvido com **Next.js 15** e **TypeScript**, com interface moderna baseada em componentes acessíveis, animações suaves e integração com serviços externos para autenticação, pagamentos e inteligência artificial.
+
+---
+
+## 🚀 Tecnologias
+
+| Tecnologia | Finalidade |
+|------------|------------|
+| Next.js 15 | Framework React com SSR, rotas e build otimizado |
+| React 19 | Biblioteca para construção da interface |
+| TypeScript | Tipagem estática e maior segurança no código |
+| Tailwind CSS + shadcn/ui | Estilização e componentes prontos e acessíveis |
+| Radix UI + Lucide | Componentes acessíveis e ícones |
+| Firebase | Autenticação e banco de dados em tempo real |
+| Genkit + Google GenAI | Inteligência artificial generativa |
+| React Hook Form + Zod | Formulários controlados e validação |
+| Zustand | Gerenciamento de estado global |
+| Recharts | Gráficos e dashboards |
+| Framer Motion | Animações e transições da UI |
+
+---
+
+## 📂 Estrutura do projeto
+
+```text
+src/
+├── app/                # Rotas e páginas do Next.js App Router
+│   ├── about/         # Página sobre a loja
+│   ├── account/       # Área do usuário
+│   ├── cart/          # Carrinho de compras
+│   ├── catalog/       # Catálogo de produtos
+│   ├── checkout/      # Finalização de compra
+│   ├── contact/       # Contato com suporte
+│   ├── faq/           # Perguntas frequentes
+│   ├── product/       # Detalhes de produto
+│   ├── returns/       # Trocas e devoluções
+│   ├── shipping/      # Informações de entrega
+│   ├── layout.tsx     # Layout raiz
+│   ├── page.tsx       # Página inicial
+│   └── globals.css    # Estilos globais
+├── components/        # Componentes compartilhados
+├── lib/               # Funções auxiliares e utilitários
+├── services/          # Integrações externas (Firebase, APIs)
+├── store/             # Estados globais com Zustand
+└── hooks/             # Hooks customizados
+```
+
+---
+
+## ⚠️ Alerta de segurança
+
+> **Importante:** o arquivo `.env` do projeto contém credenciais e já está presente no histórico do repositório.
+>
+> - Se essas credenciais forem de produção, **rotacione-as imediatamente**.
+> - Remova o arquivo do histórico com `git rm --cached .env` e adicione ao `.gitignore` antes de versionar novamente.
+> - Use um gerenciador de segredos para deploy em produção (ex.: variáveis de ambiente da Vercel).
+
+---
+
+## 🛠️ Como rodar localmente
+
+### Pré-requisitos
+
+- Node.js 18+
+- npm
+- Git
+
+### Passos
+
+```bash
+# 1. Clone o repositório
+git clone https://github.com/ConeBill/playVisionSiteVendas.git
+
+# 2. Acesse a pasta do projeto
+cd playVisionSiteVendas
+
… omitted 96 diff line(s) across 1 additional file(s)/section(s)