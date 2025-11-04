# TaskFlow
Aplicativo para Gerenciar projetos tipo Trello


# 📋 TaskFlow - Sistema de Gestão de Projetos
 
 ![TaskFlow](https://img.shields.io/badge/version-1.0.0-blue)
 ![License](https://img.shields.io/badge/license-MIT-green)
 
 Sistema completo de gestão de projetos estilo Trello com autenticação, múltiplos quadros, drag and drop, e cores personalizadas.
 
 ## 🚀 Funcionalidades
 
- ✅ **Sistema de Autenticação** - Login e cadastro de usuários
- 📊 **Múltiplos Quadros** - Organize projetos diferentes em quadros separados
- 📝 **Listas Personalizadas** - Crie listas com cores customizadas
- 🎨 **Cartões Coloridos** - Escolha cores para destacar tarefas importantes
- 🔄 **Drag & Drop Avançado** - Arraste tarefas para reorganizar ou mover entre listas
- 🌓 **Modo Escuro** - Suporte automático a tema claro/escuro
- 💾 **Persistência de Dados** - Todos os dados salvos automaticamente
- 📱 **Design Responsivo** - Funciona perfeitamente em mobile e desktop
 
 ## 📁 Estrutura do Projeto
 
 ```
 taskflow/
 ├── index.html              # Página principal
 ├── css/
 │   └── styles.css         # Estilos da aplicação
 ├── js/
 │   ├── storage.js         # Gerenciamento de armazenamento
 │   ├── database.js        # Banco de dados local
 │   ├── auth.js            # Autenticação de usuários
 │   ├── boards.js          # Gerenciamento de quadros
 │   ├── lists.js           # Gerenciamento de listas
 │   ├── tasks.js           # Gerenciamento de tarefas
 │   ├── dragdrop.js        # Sistema de drag and drop
 │   ├── ui.js              # Funções de interface
 │   └── main.js            # Inicialização da aplicação
 └── README.md              # Este arquivo
 ```
 
 ## 🛠️ Como Rodar no VSCode
 
 ### Pré-requisitos
 
- Visual Studio Code instalado
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
 
 ### Passo a Passo
 
1. **Abra o VSCode**

2. **Abra a pasta do projeto**
  - Arquivo → Abrir Pasta
  - Selecione a pasta `taskflow`

3. **Instale a extensão Live Server (Recomendado)**
  - Clique no ícone de extensões (Ctrl+Shift+X)
  - Procure por "Live Server"
  - Instale a extensão do Ritwick Dey
 
4. **Execute o projeto**
    
   **Opção 1 - Com Live Server (Recomendado):**
   - Clique com botão direito no arquivo `index.html`
   - Selecione "Open with Live Server"
   - O navegador abrirá automaticamente em `http://localhost:5500`
 
   **Opção 2 - Sem Live Server:**
   - Simplesmente abra o arquivo `index.html` no seu navegador
   - Arraste o arquivo para a janela do navegador
   - Ou use Ctrl+O no navegador e selecione o arquivo

 ## 📖 Como Usar

### Primeiro Acesso

1. **Criar uma Conta**
   - Clique em "Criar conta"
   - Preencha: Nome completo, Usuário e Senha
   - Clique em "Criar Conta"
 
2. **Fazer Login**
   - Use o usuário e senha criados
   - Clique em "Entrar"
 
### Gerenciando Quadros
 
1. **Criar Quadro**
   - Clique em "+ Novo Quadro"
   - Digite o nome (ex: "Projeto Web", "Marketing")
   - Clique em "Salvar"
 
2. **Editar/Excluir Quadro**
   - Clique em "✏️ Editar Quadro"
   - Modifique o nome ou clique em "Excluir"
 
### Gerenciando Listas
 
1. **Criar Lista**
   - Clique em "+ Nova Lista"
   - Digite o nome (ex: "A Fazer", "Em Progresso")
   - **Escolha uma cor** para destacar a lista
   - Clique em "Salvar"
 
2. **Editar/Excluir Lista**
   - Clique no ícone de lápis ✏️ na lista
   - Ou clique no ícone de lixeira 🗑️ para excluir
 
### Gerenciando Tarefas
 
1. **Criar Tarefa**
   - Clique em "+ Adicionar Tarefa" em qualquer lista
   - Preencha título e descrição
   - **Escolha uma cor** para o cartão (opcional)
   - Clique em "Salvar"
 
2. **Mover Tarefas**
    
   **Arrastar e Soltar:**
    - Clique e segure uma tarefa
    - Arraste para cima/baixo para reordenar
    - Arraste para outra lista para mover
    - Solte onde desejar
 
    **Mover para Outro Quadro:**
    - Clique na tarefa para ver detalhes
    - Use o menu "Mover para outro quadro"
    - Selecione o quadro e lista de destino
 
3. **Editar/Excluir Tarefa**
    - Clique na tarefa para ver detalhes
    - Clique em "Editar" ou "Excluir"
 
## 🎨 Personalização de Cores
 
### Cores para Listas
 
Escolha entre 9 cores vibrantes para suas listas:
 - 🔴 Vermelho - Urgente/Alta prioridade
 - 🟠 Laranja - Importante
 - 🟡 Amarelo - Atenção
 - 🟢 Verde - Concluído/Aprovado
 - 🔵 Azul - Em progresso
 - 🟣 Roxo - Design/Criativo
 - 🟤 Marrom - Pesquisa
 - ⚫ Cinza - Backlog
 - ⚪ Branco - Padrão
 
### Cores para Cartões
 
 Destaque tarefas importantes com cores:
 - Use cores para categorizar por tipo
 - Ou para indicar prioridade
 - Ou para diferenciar responsáveis
 
## 💡 Dicas de Uso
 
1. **Organize por Status**
    ```
    📋 A Fazer → ⚙️ Em Progresso → ✅ Concluído
    ```
 
2. **Organize por Prioridade**
    ```
    🔴 Urgente → 🟡 Normal → 🟢 Baixa
    ```
 
 3. **Use Múltiplos Quadros**
    - Um quadro para cada projeto
    - Um quadro pessoal e outro profissional
    - Quadros por equipe ou departamento
 
 4. **Cores Consistentes**
    - Defina um padrão de cores para sua equipe
    - Exemplo: Vermelho = Urgente, Verde = Concluído
 
## 🔒 Segurança e Privacidade
 
 - Todos os dados são armazenados **localmente** no seu navegador
 - Nenhum dado é enviado para servidores externos
 - Cada usuário tem seu próprio espaço isolado
 - Os dados persistem mesmo após fechar o navegador
 
## 🐛 Solução de Problemas
 
### Os dados não estão sendo salvos
 
 - Verifique se o localStorage está habilitado no navegador
 - Não use modo anônimo/privado
 - Limpe o cache se necessário
 
### O drag and drop não funciona
 
 - Certifique-se de estar usando um navegador moderno
 - Tente recarregar a página (F5)
 
### Esqueci minha senha
 
 - Os dados estão armazenados localmente
 - Se esquecer a senha, será necessário criar uma nova conta
 - **Dica:** Use senhas fáceis de lembrar em ambiente local
 
 ## 🚀 Próximas Funcionalidades (Roadmap)
 
 - [ ] Exportar/Importar quadros
 - [ ] Compartilhamento de quadros
 - [ ] Anexos em tarefas
 - [ ] Comentários em tarefas
 - [ ] Datas de vencimento
 - [ ] Notificações
 - [ ] Pesquisa global
 - [ ] Tags/Etiquetas
 
## 📝 Tecnologias Utilizadas
 
 - **HTML5** - Estrutura da aplicação
 - **CSS3** - Estilização e animações
 - **JavaScript (ES6+)** - Lógica da aplicação
 - **TailwindCSS** - Framework CSS
 - **LocalStorage API** - Persistência de dados
 - **Drag and Drop API** - Arrastar e soltar
 
## 📄 Licença
 
 Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.
 
## 👨‍💻 Autor
 
Desenvolvido com ❤️ para facilitar a gestão de projetos
 
---
230 
+ 231 **Versão:** 1.0.0  
+ 232 **Última atualização:** 2024
