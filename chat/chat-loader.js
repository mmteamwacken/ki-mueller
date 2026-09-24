/* ki-mueller.de – Chat-Button + Hinweis-Popup
   Einbindung auf jeder Seite vor </body>:
   <script src="/chat/chat-loader.js" defer></script>
   Chat (n8n-chat.umd.js / n8n-chat.css) lädt erst beim Klick, von der eigenen Domain. */
(function(){
  if(document.getElementById('kim-chat-btn')) return;
  var st=document.createElement('style');st.textContent="\n:body{\n  --chat--color-primary:#a9772b;\n  --chat--color-primary-shade-50:#96691f;\n  --chat--color-primary-shade-100:#835b1b;\n  --chat--color-secondary:#bb5f37;\n  --chat--toggle--background:#a9772b;\n  --chat--toggle--hover--background:#96691f;\n  --chat--header--background:#2c2417;\n  --chat--message--user--background:#a9772b;\n}\n/* Eigener Chat-Button: immer sichtbar, l\u00e4dt erst beim Klick etwas */\n#kim-chat-btn{\n  position:fixed;right:20px;bottom:20px;z-index:9998;\n  width:64px;height:64px;border-radius:50%;border:0;cursor:pointer;\n  background:#a9772b;color:#fff;display:grid;place-items:center;\n  box-shadow:0 8px 24px -8px rgba(44,36,23,.5);transition:transform .15s,background .15s;\n}\n#kim-chat-btn:hover{background:#96691f;transform:scale(1.05)}\n#kim-chat-btn svg{width:28px;height:28px}\n#kim-chat-btn.loading{opacity:.7;cursor:progress}\n/* Hinweis-Popup */\n#chat-hint{\n  position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;\n  max-width:560px;margin:0 auto;\n  background:#fffdf8;color:#2c2417;\n  border:1px solid #e3d7c2;border-radius:14px;\n  box-shadow:0 12px 40px -12px rgba(44,36,23,.35);\n  padding:22px 24px;font-family:'Inter',system-ui,sans-serif;\n  font-size:.92rem;line-height:1.55;\n}\n#chat-hint.hidden{display:none}\n#chat-hint h4{font-family:'Exo 2',sans-serif;font-weight:700;font-size:1.05rem;margin:0 0 8px}\n#chat-hint p{margin:0 0 16px;color:#6e6451}\n#chat-hint a{color:#a9772b;text-decoration:underline}\n#chat-hint button{\n  font-family:'Exo 2',sans-serif;font-weight:700;font-size:.9rem;\n  border-radius:8px;padding:11px 18px;cursor:pointer;border:none;\n  background:#a9772b;color:#241b0d;transition:transform .15s ease;\n}\n#chat-hint button:hover{transform:translateY(-1px)}\n@media(max-width:640px){\n  #chat-hint{bottom:96px}          /* nicht \u00fcber dem Chat-Button */\n  #chat-hint button{width:100%}\n}\n";document.head.appendChild(st);
  var wrap=document.createElement('div');wrap.innerHTML="<button id=\"kim-chat-btn\" type=\"button\" aria-label=\"Chat mit dem KI-Assistenten \u00f6ffnen\">\n  <svg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.5 3.4 6L4.6 21l4.3-2.3c1 .2 2 .3 3.1.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z\"/></svg>\n</button>\n<div id=\"chat-hint\" class=\"hidden\" role=\"dialog\" aria-live=\"polite\" aria-label=\"Hinweis zum Chat-Assistenten\">\n  <h4>Hinweis zum Chat-Assistenten</h4>\n  <p>\n    Unten rechts erreichst du meinen KI-Chat-Assistenten. Du schreibst dort mit einer KI, nicht mit einem Menschen.\n    Erst wenn du den Chat \u00f6ffnest, wird f\u00fcr den Gespr\u00e4chsverlauf eine Kennung in deinem Browser gespeichert\n    und deine Nachrichten werden zur Beantwortung an meinen Server \u00fcbertragen.\n    Mehr dazu in der <a href=\"/datenschutz\">Datenschutzerkl\u00e4rung</a>.\n  </p>\n  <button type=\"button\" id=\"chat-hint-ok\">OK, verstanden!</button>\n</div>";
  while(wrap.firstChild) document.body.appendChild(wrap.firstChild);

  var HINT_KEY = 'ki-mueller-chat-hint';
  var btn  = document.getElementById('kim-chat-btn');
  var hint = document.getElementById('chat-hint');
  var loaded = false;

  // Hinweis einmal zeigen, bis "OK, verstanden!" geklickt wurde
  var seen = null;
  try{ seen = localStorage.getItem(HINT_KEY); }catch(e){}
  if(!seen) hint.classList.remove('hidden');
  document.getElementById('chat-hint-ok').addEventListener('click', function(){
    try{ localStorage.setItem(HINT_KEY, 'ok'); }catch(e){}
    hint.classList.add('hidden');
  });

  // Chat wird erst beim Klick geladen (von der eigenen Domain, kein CDN)
  function openChat(){
    if(loaded) return;
    loaded = true;
    btn.classList.add('loading');
    hint.classList.add('hidden');

    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = '/chat/n8n-chat.css';
    document.head.appendChild(css);

    var s = document.createElement('script');
    s.src = '/chat/n8n-chat.umd.js';
    s.onload = function(){
      window.N8nChat.createChat({
        webhookUrl: 'https://n8n.srv1799126.hstgr.cloud/webhook/cb5bb668-0f0d-42ab-bba5-b2f27bab8fe0/chat',
        initialMessages: [
          '🤖 Hinweis: Sie schreiben mit einem KI-Assistenten, nicht mit einer echten Person.',
          'Hallo! Ich bin der KI-Assistent von ki-mueller. Frag mich, was eine KI-Automatisierung für deinen Betrieb bringen kann – oder probier einfach aus, wie sich so ein Agent anfühlt.'
        ],
        i18n: {
          en: {
            title: 'ki-mueller – KI-Assistent',
            subtitle: '🤖 KI-Chat (kein Mensch). Antwort in Sekunden.',
            getStarted: 'Neue Unterhaltung',
            inputPlaceholder: 'Frag mich etwas …',
            footer: 'Automatisierte Antworten durch KI. Für verbindliche Auskünfte: info@ki-mueller.de',
            closeButtonTooltip: 'Schließen'
          }
        }
      });
      // n8n bringt einen eigenen Button mit: unseren ausblenden, Chat direkt öffnen
      var tries = 0, t = setInterval(function(){
        var toggle = document.querySelector('.chat-window-toggle');
        if(toggle || ++tries > 50){
          clearInterval(t);
          btn.style.display = 'none';
          if(toggle) toggle.click();
        }
      }, 100);
    };
    s.onerror = function(){ loaded = false; btn.classList.remove('loading'); };
    document.body.appendChild(s);
  }
  btn.addEventListener('click', openChat);

  // Kompatibel zum alten Link in der Datenschutzerklärung: Chat-Daten im Browser löschen
  window.resetChatConsent = function(){
    try{
      localStorage.removeItem('n8n-chat/sessionId');
      localStorage.removeItem('ki-mueller-chat-consent');
      localStorage.removeItem(HINT_KEY);
    }catch(e){}
    location.reload();
  };

})();
