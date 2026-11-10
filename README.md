# Rex Rush 🦖

Jogo "runner" em pixel art colorida para iPhone, feito com **Capacitor 8** sobre o motor JavaScript do [t-rex-runner](https://github.com/wayou/t-rex-runner). Toque para saltar, desvie dos cactos e pterodáctilos e entre no Top 10.

- Intro (toque para saltar), menu com **New Game** e Top 10, ecrã de Game Over com *Play Again* / *Menu*.
- Ranking guardado no dispositivo (Capacitor Preferences → `UserDefaults`) e funciona offline.
- Horizontal, adaptado às áreas seguras; pausa quando o app sai do primeiro plano.
- iOS 17 ou superior, só iPhone. Bundle ID: `com.ferreira.trex`.

Estrutura: `www/` (jogo: `runner.js` original modificado, `sprites.js` arte própria, `app.js` ecrãs, `ranking.js`), `ios/` (projeto Xcode), `test/` (testes do ranking).

## 1. Pré-requisitos e execução no Mac

1. Instale o **Xcode** pela App Store (testado com Xcode 26.6), abra-o uma vez e aceite os componentes adicionais. Em *Settings → Components* instale um runtime do iOS Simulator (17 ou superior).
2. Instale o **Node.js** LTS (testado com Node 24): `brew install node` ou pelo site nodejs.org.
3. No terminal:

```bash
cd ~/Source/t-rex-ios
npm install
npm test
npx cap sync ios
npx cap open ios
```

4. No Xcode escolha um simulador de iPhone no topo e carregue em ▶ (Run).

Para testar só a lógica do jogo no navegador, abra `www/index.html` (clique/espaço para saltar).

## 2. Conta Apple gratuita, assinatura automática e identificador

1. Xcode → *Settings → Accounts* → **+** → *Apple ID* e entre com o seu Apple ID (não precisa de pagar o programa de programador).
2. No navegador de projeto, selecione **App** → alvo **App** → separador *Signing & Capabilities*.
3. Marque **Automatically manage signing** e em *Team* escolha "O seu nome (Personal Team)".
4. Em *Bundle Identifier* use `com.ferreira.trex`. Se o Xcode disser que já está em uso, troque por algo único (ex.: `com.ferreira.trex2`) e atualize `appId` em `capacitor.config.json`.

## 3. Ligar o iPhone, Modo de programador e instalar

1. Ligue o iPhone ao Mac por cabo, desbloqueie-o e toque em **Confiar** neste computador.
2. No Xcode, escolha o seu iPhone como destino e carregue em ▶. Na primeira vez o iPhone pede o **Modo de programador**: *Ajustes → Privacidade e Segurança → Modo de programador* → ativar → reiniciar → confirmar.
3. Ao abrir o app pela primeira vez aparece "Programador não fidedigno": vá a *Ajustes → Geral → VPN e Gestão de Dispositivos*, toque no seu Apple ID e em **Confiar**.
4. Depois do primeiro emparelhamento pode instalar por Wi‑Fi (*Window → Devices and Simulators → Connect via network*).

## 4. Atualizar o app e renovar a instalação

- Depois de alterar ficheiros em `www/`, corra `npx cap sync ios` e carregue em ▶ no Xcode. O ranking mantém-se (a instalação substitui o app sem apagar os dados).
- Com conta gratuita o perfil expira ao fim de **7 dias**: o app deixa de abrir. Ligue o iPhone e carregue em ▶ outra vez no Xcode para renovar (não apague o app, para não perder o ranking).
- Limites da conta gratuita: até 3 apps instalados por dispositivo e poucos identificadores novos por semana.

## 5. Para TestFlight ou App Store no futuro

- Inscrever-se no **Apple Developer Program** (pago, anual) e escolher essa equipa em *Signing*.
- Criar o app no **App Store Connect** com o mesmo Bundle ID, nome único, ícone 1024×1024 próprio (em `ios/App/App/Assets.xcassets`), capturas de ecrã, descrição, classificação etária e URL da política de privacidade.
- Subir a versão (`MARKETING_VERSION`) e o build (`CURRENT_PROJECT_VERSION`) a cada envio; *Product → Archive → Distribute App*.
- Preencher as "etiquetas de privacidade" (o app não recolhe dados; o manifesto `ios/App/App/PrivacyInfo.xcprivacy` declara só o uso de `UserDefaults`, motivo CA92.1).
- Rever o ecrã de lançamento e o ícone (ainda são os do modelo do Capacitor) antes de publicar.

## Licenças

- Código e arte próprios (`sprites.js`, `app.js`, `ranking.js`, `style.css`): MIT, ver `LICENSE`.
- `www/runner.js` deriva do código do Chromium (© The Chromium Authors) extraído por wayou: licença BSD de 3 cláusulas, ver `LICENSE-t-rex-runner`. Os avisos originais estão preservados no topo do ficheiro.
- Não são usados sprites, sons nem fontes do projeto original: a arte é desenhada em código e os sons são gerados com Web Audio.
