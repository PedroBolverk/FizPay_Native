-- FizPay Mobile

Aplicação mobile de carteira digital desenvolvida em React Native (Expo), seguindo o design do Figma e utilizando SQLite para mock de dados e AsyncStorage para estados globais.

Pré-requisitos

Antes de iniciar, você precisa ter os seguintes itens instalados no seu ambiente de desenvolvimento: Node.js (versão 17 ou superior), npm ou yarn, e Expo CLI globalmente. Se o Expo CLI não estiver instalado, instale-o com npm install -g expo-cli ou yarn global add expo-cli. Além disso, você precisará de um Emulador Android ou iOS, ou um dispositivo físico com o aplicativo Expo Go instalado.

Instalação

Primeiro, clone o repositório com o comando git clone https://github.com/PedroBolverk/FizPay_Native.git, e então acesse a pasta cd FizPay_Native. Após isso, instale as dependências do projeto utilizando npm install ou yarn install, conforme sua preferência e para rodar o projeto npx expo start.

Teclas: a (para rodar no emulador android)
Para IOS ou demais dispositivos físicos: (Escanear o QR Code com o expo go instalado no aparelho)

Caso haja problemas com o cache ou dependências nativas, execute os comandos expo doctor e expo install para limpar o cache e garantir que tudo esteja instalado corretamente.

Configuração do Banco de Dados

O banco de dados SQLite será criado automaticamente na primeira execução do aplicativo, com dados mock de demonstração. Não será necessário criar tabelas manualmente. Se em algum momento durante o desenvolvimento você precisar reiniciar o banco de dados, execute o código import { resetAndSeedSync } from './src/db/index'; resetAndSeedSync(); para limpar todas as tabelas e aplicar novamente os dados mock.

Executando o Aplicativo

Se você estiver utilizando um emulador Android, execute npx expo start, o que abrirá a interface do Expo onde você pode iniciar o aplicativo no emulador. Caso queira testar em um dispositivo físico Android ou iOS, basta abrir o aplicativo Expo Go no seu celular e escanear o QR code exibido no terminal após rodar o comando expo start.

Funcionalidades Implementadas

O aplicativo possui as funcionalidades seguintes:

Telas conforme o design do Figma.

Login e cadastro de contas, utilizando dados mock armazenados no SQLite.

Armazenamento de estados globais através do AsyncStorage.

Mock de transações e cashback.

Rotas dinâmicas implementadas com expo-router.

Suporte à autenticação biométrica (FaceID / Fingerprint), utilizando Expo LocalAuthentication.

Estrutura do Projeto

A estrutura do projeto é organizada da seguinte maneira:

/src contém os arquivos principais da aplicação.

/components: Componentes reutilizáveis em várias partes do aplicativo.

/context: Gerenciamento de estados globais com contextos.

/db: Banco de dados SQLite.

/screens: Telas do aplicativo.

/theme: Tokens de cores, espaçamentos e raios de borda.

/assets: Contém imagens e ícones utilizados no aplicativo.

Observações

Todas as transações, contas e dados de cashback são mockados para fins de demonstração.

A API externa ainda não foi integrada, mas existe uma classe pronta para ser utilizada.

A aplicação segue boas práticas de React Native e TypeScript, com tipagem forte e componentes reutilizáveis.