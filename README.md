# EduQi - Sistema de Gerenciamento de Questões Educacionais

Um sistema web moderno para criação, organização e gerenciamento de questões educacionais, desenvolvido com Next.js, TypeScript e Material-UI.

## 📋 Sobre o Projeto

O EduQi é uma plataforma que permite:

- **Cadastro de Questões**: Criação de questões com enunciado, 5 alternativas (A-E), marcação da resposta correta, seleção de assunto e definição de dificuldade
- **Gerenciamento de Assuntos**: Organização hierárquica de assuntos em formato de árvore
- **Status de Questões**: Controle de status (rascunho, aprovado, reprovado)
- **Interface Intuitiva**: Design responsivo e moderno com Material-UI
- **Sistema de Autenticação**: Login e cadastro de usuários

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd subject-eduqi
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse no seu navegador:
```
http://localhost:3000
```

## 📦 Scripts Disponíveis

- `npm run dev` - Executa o projeto em modo de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Executa a build de produção
- `npm run lint` - Executa o linter para verificar o código

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Material-UI v7** - Biblioteca de componentes
- **Redux Toolkit** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **React 19** - Biblioteca JavaScript

## 📁 Estrutura do Projeto

```
├── app/                    # Páginas da aplicação (App Router)
├── components/             # Componentes reutilizáveis
├── hooks/                  # Custom hooks
├── store/                  # Configuração do Redux
├── services/               # Serviços de API
├── types/                  # Definições de tipos TypeScript
└── contexts/               # Context providers
```