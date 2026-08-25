/* Rexatools — panier (localStorage) + drawer + burger + interactions */
(function () {
  'use strict';
  var DATA = window.REXA_DATA || { produits: [], boutique: { livraison_offerte_des: 500 } };
  var SEUIL = DATA.boutique.livraison_offerte_des || 500;
  var KEY = 'rexa_cart_v1';
  var ROOT = document.body.getAttribute('data-root') || '';

  function produit(id) {
    for (var i = 0; i < DATA.produits.length; i++) if (DATA.produits[i].id === id) return DATA.produits[i];
    return null;
  }
  function lireCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function ecrireCart(c) { localStorage.setItem(KEY, JSON.stringify(c)); majUI(); }
  function totalQte(c) { return c.reduce(function (s, l) { return s + l.qty; }, 0); }
  function sousTotal(c) {
    return c.reduce(function (s, l) { var p = produit(l.id); return p ? s + p.prix * l.qty : s; }, 0);
  }
  function eur(n) { return n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €'; }

  window.rexaAdd = function (id, qty) {
    qty = qty || 1;
    var c = lireCart();
    var l = c.find(function (x) { return x.id === id; });
    if (l) l.qty += qty; else c.push({ id: id, qty: qty });
    ecrireCart(c);
    ouvrirDrawer();
  };
  window.rexaSetQty = function (id, qty) {
    var c = lireCart();
    var l = c.find(function (x) { return x.id === id; });
    if (!l) return;
    l.qty = qty;
    if (l.qty <= 0) c = c.filter(function (x) { return x.id !== id; });
    ecrireCart(c);
  };
  window.rexaRemove = function (id) {
    ecrireCart(lireCart().filter(function (x) { return x.id !== id; }));
  };

  /* ---- barre livraison offerte ---- */
  function barreLivraison(st) {
    var reste = SEUIL - st;
    var pct = Math.min(100, Math.round(st / SEUIL * 100));
    var txt = reste > 0
      ? 'Plus que <strong>' + eur(reste) + '</strong> pour la livraison offerte'
      : '<strong>Livraison offerte</strong> sur votre commande 🎉';
    return '<div class="ship-bar"><p>' + txt + '</p><div class="ship-track"><span style="width:' + pct + '%"></span></div></div>';
  }

  /* ---- drawer ---- */
  function rendreDrawer() {
    var c = lireCart();
    var corps = document.getElementById('drawer-body');
    var pied = document.getElementById('drawer-foot');
    if (!corps) return;
    if (!c.length) {
      corps.innerHTML = '<p class="cart-vide">Votre panier est vide.<br>Nos outils n\u2019attendent que vous.</p>';
      pied.innerHTML = '<a class="btn btn-plein" href="' + ROOT + 'index.html#categories">Voir les cat\u00e9gories</a>';
      return;
    }
    var st = sousTotal(c);
    var html = barreLivraison(st);
    c.forEach(function (l) {
      var p = produit(l.id); if (!p) return;
      html += '<div class="d-ligne">' +
        '<img src="' + p.images[0] + '" alt="' + p.nom + '" loading="lazy">' +
        '<div class="d-inf"><a href="' + ROOT + 'produit/' + p.id + '.html">' + p.nom + '</a>' +
        '<span class="d-prix">' + eur(p.prix) + '</span>' +
        '<div class="qte"><button aria-label="Diminuer" onclick="rexaSetQty(\'' + p.id + '\',' + (l.qty - 1) + ')">−</button>' +
        '<span>' + l.qty + '</span>' +
        '<button aria-label="Augmenter" onclick="rexaSetQty(\'' + p.id + '\',' + (l.qty + 1) + ')">+</button></div></div>' +
        '<button class="d-suppr" aria-label="Retirer" onclick="rexaRemove(\'' + p.id + '\')">✕</button></div>';
    });
    corps.innerHTML = html;
    pied.innerHTML = '<div class="d-total"><span>Sous-total</span><strong>' + eur(st) + '</strong></div>' +
      '<a class="btn btn-ligne" href="' + ROOT + 'panier.html">Voir le panier</a>' +
      '<a class="btn btn-plein" href="' + ROOT + 'panier.html#paiement">Passer la commande</a>' +
      '<p class="d-paiement">CB · PayPal · Apple Pay · <strong>Bitcoin / ETH / USDT</strong></p>';
  }
  function ouvrirDrawer() {
    document.body.classList.add('drawer-ouvert');
    rendreDrawer();
  }
  window.rexaOpenDrawer = ouvrirDrawer;
  window.rexaCloseDrawer = function () { document.body.classList.remove('drawer-ouvert'); };

  /* ---- page panier ---- */
  function rendrePagePanier() {
    var zone = document.getElementById('page-panier');
    if (!zone) return;
    var c = lireCart();
    if (!c.length) {
      zone.innerHTML = '<p class="cart-vide">Votre panier est vide.</p><p style="text-align:center"><a class="btn btn-plein" href="index.html#categories">D\u00e9couvrir nos outils</a></p>';
      return;
    }
    var st = sousTotal(c);
    var html = barreLivraison(st) + '<div class="p-table">';
    c.forEach(function (l) {
      var p = produit(l.id); if (!p) return;
      html += '<div class="p-ligne">' +
        '<img src="' + p.images[0] + '" alt="' + p.nom + '" loading="lazy">' +
        '<div class="p-inf"><a href="produit/' + p.id + '.html">' + p.nom + '</a><span>' + eur(p.prix) + ' / unit\u00e9</span></div>' +
        '<div class="qte"><button aria-label="Diminuer" onclick="rexaSetQty(\'' + p.id + '\',' + (l.qty - 1) + ')">−</button>' +
        '<span>' + l.qty + '</span>' +
        '<button aria-label="Augmenter" onclick="rexaSetQty(\'' + p.id + '\',' + (l.qty + 1) + ')">+</button></div>' +
        '<strong class="p-tot">' + eur(p.prix * l.qty) + '</strong>' +
        '<button class="d-suppr" aria-label="Retirer" onclick="rexaRemove(\'' + p.id + '\')">✕</button></div>';
    });
    var livraison = st >= SEUIL ? 0 : 15;
    html += '</div><div class="p-recap">' +
      '<div><span>Sous-total</span><span>' + eur(st) + '</span></div>' +
      '<div><span>Livraison estim\u00e9e</span><span>' + (livraison ? eur(livraison) : 'Offerte') + '</span></div>' +
      '<div class="p-grand"><span>Total</span><span>' + eur(st + livraison) + '</span></div>' +
      '<a class="btn btn-plein" href="#paiement">Passer la commande</a></div>';
    zone.innerHTML = html;
  }

  /* ---- compteur + init ---- */
  function majUI() {
    var n = totalQte(lireCart());
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = n;
      el.classList.toggle('vide', n === 0);
    });
    rendreDrawer();
    rendrePagePanier();
  }

  document.addEventListener('DOMContentLoaded', function () {
    majUI();
    var burger = document.getElementById('burger');
    if (burger) burger.addEventListener('click', function () { document.body.classList.toggle('menu-ouvert'); });
    var voile = document.getElementById('voile');
    if (voile) voile.addEventListener('click', function () {
      document.body.classList.remove('drawer-ouvert', 'menu-ouvert');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.body.classList.remove('drawer-ouvert', 'menu-ouvert');
    });
    /* fiche produit : galerie */
    document.querySelectorAll('.minis button').forEach(function (b) {
      b.addEventListener('click', function () {
        var img = document.querySelector('.galerie .principale');
        if (img) img.src = b.getAttribute('data-img');
        document.querySelectorAll('.minis button').forEach(function (x) { x.classList.remove('actif'); });
        b.classList.add('actif');
      });
    });
    /* fiche produit : quantité + ajout */
    var qv = document.getElementById('qte-val');
    var moins = document.querySelector('[data-qte-moins]');
    var plus = document.querySelector('[data-qte-plus]');
    if (moins) moins.addEventListener('click', function () {
      qv.textContent = Math.max(1, parseInt(qv.textContent, 10) - 1);
    });
    if (plus) plus.addEventListener('click', function () {
      qv.textContent = parseInt(qv.textContent, 10) + 1;
    });
    var addFiche = document.querySelector('[data-add-fiche]');
    if (addFiche) addFiche.addEventListener('click', function () {
      window.rexaAdd(addFiche.getAttribute('data-add-fiche'), parseInt(qv.textContent, 10));
    });
    /* démo paiement : aucun paiement réel */
    document.querySelectorAll('[data-demo-pay]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Maquette de d\u00e9monstration : aucun paiement n\u2019est d\u00e9clench\u00e9.');
      });
    });
  });
})();
