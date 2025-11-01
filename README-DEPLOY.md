## Como hospedar este site gratuitamente

Escolhi incluir instruções para as opções mais simples e gratuitas: GitHub Pages, Netlify (Drop) e Vercel.

Antes de começar: abra o terminal (PowerShell) na pasta do projeto:

```powershell
Push-Location 'd:\Downloads\flowith_oracle_K3pqjjl\K3pqjjl'
``` 

1) Método rápido — Netlify Drop (sem git)
- Vá para https://app.netlify.com/drop
- Arraste a pasta inteira do projeto (`K3pqjjl`) para a área "Drop site here".
- O Netlify fará o upload e fornecerá uma URL pública em poucos segundos.

Prós: sem conta (opcional), muito rápido.
Contras: sem deploy automático a partir de git (mas funciona para testes).

2) GitHub Pages (recomendado se você tiver conta GitHub)
- Crie um repositório no GitHub (ex.: `inforcell-site`).
- No PowerShell faça:

```powershell
git init
git add .
git commit -m "site inicial"
# adicione o remoto (substitua URL pelo repositório que você criou)
git remote add origin https://github.com/SEU-USUARIO/NOME-REPO.git
git branch -M main
git push -u origin main
```

- No GitHub vá em Settings → Pages e escolha branch `main` (root) como origem. Salve.
- A URL do site estará disponível em `https://SEU-USUARIO.github.io/NOME-REPO/` após alguns minutos.

Observação: se preferir deploy automático com GitHub Actions para `gh-pages`, eu incluí um workflow opcional (`.github/workflows/deploy.yml`) — veja abaixo.

3) Vercel (ótimo para sites estáticos e deploy automático)
- Vá em https://vercel.com, crie conta e clique em "New Project" → import from GitHub.
- Escolha o repositório e importe. Vercel detecta site estático e publica automaticamente.

---

Arquivos úteis adicionados aqui:
- `.github/workflows/deploy.yml` — workflow opcional para publicar em GitHub Pages (se você preferir essa rota).

Se quiser, eu posso:
- criar o repo no seu GitHub (preciso que você me forneça um token com permissões) — **não recomendo enviar tokens aqui**; prefira executar os comandos localmente;
- ou guiá-lo passo-a-passo enquanto você executa os comandos.

Diga qual método prefere (Netlify Drop, GitHub Pages, Vercel) e eu sigo com os passos ou configuro o que for possível localmente.
