# Rexatools — maquette CRO (préfiguration Shopify)

Mini-site statique (HTML/CSS/JS vanilla, zéro dépendance, zéro build).
Version AUTONOME : le CSS et le JS sont incrustés dans chaque page — le site
s'affiche correctement même si le dossier assets/ n'est pas uploadé qui applique
l'audit CRO de rexatools.com. Panier fonctionnel en localStorage, paiements
affichés mais NON fonctionnels (maquette de démonstration).

## Arborescence

```
/index.html            Accueil (modèle CRO complet)
/panier.html           Panier + section paiement (démo)
/categories/*.html     3 pages catégories
/produit/*.html        10 fiches produit
/pages/*.html          Livraison, retours, CGV, mentions légales, contact
/assets/css|js|img     Styles, panier JS, données, favicon
/products.json         Source des données produits (10 produits, 3 catégories)
/.nojekyll             Désactive Jekyll sur GitHub Pages
```

## Déployer sur GitHub Pages (5 minutes)

1. Créez un dépôt sur github.com (ex. `rexatools-maquette`), public.
2. Envoyez tout le contenu de ce dossier à la RACINE du dépôt :
   ```bash
   cd rexatools-site
   git init
   git add .
   git commit -m "Maquette Rexatools"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/rexatools-maquette.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : Deploy from a branch →
   Branch : main / (root) → Save**.
4. Attendez ~1 minute. Le site est en ligne sur
   `https://VOTRE-COMPTE.github.io/rexatools-maquette/`.

Alternative sans ligne de commande : sur la page du dépôt, **Add file →
Upload files**, glissez tout le contenu du dossier (y compris `.nojekyll`),
puis activez Pages comme en 3.

## Tester en local

Ouvrez simplement `index.html` dans un navigateur (double-clic) — tout
fonctionne en local, panier compris (les données sont chargées via
`assets/js/data.js`, pas de fetch, donc pas de blocage CORS en `file://`).

## Notes / hypothèses

- **Images produits** : chargées depuis rexatools.com (hotlink). Pour la
  version finale Shopify, ré-uploader les visuels dans Shopify.
- **`products.json`** est la source des données ; `assets/js/data.js` en est
  la copie exécutable (régénérer data.js si vous modifiez le JSON :
  `python3 -c "import json;d=json.load(open('products.json'));open('assets/js/data.js','w').write('window.REXA_DATA = '+json.dumps(d,ensure_ascii=False)+';')"`).
- **Palette** déduite de l'univers Rexatools (charbon / acier / rouge
  atelier) — le logo réel est réutilisé tel quel.
- **Avis clients, note globale et chiffres** : contenus de démonstration à
  remplacer par de vrais avis (Google / Trustpilot) avant mise en ligne.
- **Paiements** (CB, PayPal, Apple/Google Pay, BTC/ETH/USDT) : badges et
  boutons visibles partout mais volontairement inactifs.
- **Formulaires** (contact, newsletter) : non fonctionnels, avec message
  explicite de démonstration.


## Déployer sur Vercel

1. vercel.com → **Add New → Project** (ou drag & drop sur le dashboard).
2. Glissez LE DOSSIER ENTIER `rexatools-site` (pas les fichiers un par un,
   pas le zip) — vérifiez que `index.html` est bien à la racine du projet.
3. Framework preset : **Other**. Aucun build. Deploy.

Si le style ne s'affichait pas sur un ancien déploiement : le dossier
`assets/` n'avait pas été uploadé. Cette version incruste CSS et JS dans
chaque page, le problème ne peut plus se produire.
