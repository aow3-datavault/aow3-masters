# Art of War Masters

Interactive RU/EN preview for a 32-player, one-on-one Art of War Masters tournament.

- [English preview](https://aow3-datavault.github.io/aow3-masters/?lang=en)
- [Русское превью](https://aow3-datavault.github.io/aow3-masters/?lang=ru)

Invitations cover two returning champions and 30 Arena Qualifier players. The preview includes a player cabinet, invitation confirmation and decline, organizer reserve replacements, roster filters, the historical summer bracket, stream links and clan standings.

Discord and Telegram sign-in, messages and time selections are simulations. No accounts are connected and no invitations or messages are sent. Demo progress is stored in the browser. Historical names and results illustrate the interface and do not announce a new tournament roster. Dates, rewards and final seeding rules remain to be confirmed.

## Development

No dependencies or build step are required.

```sh
python -m http.server 8765 --bind 127.0.0.1
node --check app.js
node --check i18n.js
node --test verify.cjs i18n.test.cjs
```

Open http://127.0.0.1:8765/ . GitHub Actions checks the source and deploys only the static website files to GitHub Pages.
