/* =====================================================
   Lake View Resort — Gallery Loader
   FILE: gallery-loader.js

   Include this on your public gallery page.
   It fetches images from Google Drive via Apps Script
   and renders them into .gallery-grid
   ===================================================== */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  ✅  PASTE YOUR DEPLOYED APPS SCRIPT URL BELOW
  // ═══════════════════════════════════════════════════
  var API = 'https://script.google.com/macros/s/AKfycbxWFUPqVCfRG_-EBuGGczU-cynSt7o-MGx0ujP4mdNGbrnmLse17GNKkvXHUyLkGnryJA/exec';
  // Example:
  // var API = 'https://script.google.com/macros/s/AKfycb.../exec';
  // ═══════════════════════════════════════════════════

  var grid = document.querySelector('.gallery-grid');
  if (!grid) return;  // no gallery on this page

  loadGallery();

  function loadGallery() {
    grid.innerHTML = html(
      '🔄',
      'Loading gallery…',
      'color:var(--text-muted,#888)'
    );

    fetch(API + '?action=getImages', { redirect: 'follow' })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (!res.success || !res.data || !res.data.images.length) {
          grid.innerHTML = html('📸', 'No images in gallery yet.');
          return;
        }

        grid.innerHTML = '';
        res.data.images.forEach(function(image, idx) {
          grid.appendChild(makeItem(image, idx));
        });

        // Stagger reveal animation
        setTimeout(function() {
          var items = grid.querySelectorAll('.gallery-item');
          items.forEach(function(el, i) {
            setTimeout(function() { el.classList.add('visible'); }, i * 60);
          });
        }, 80);

        // Tell main script.js to reinit lightbox if it exists
        if (typeof window.initializeLightbox === 'function') {
          window.initializeLightbox();
        }
      })
      .catch(function(err) {
        console.error('Gallery load error:', err);
        grid.innerHTML =
          '<div style="grid-column:1/-1;text-align:center;padding:48px;color:#c00;">' +
          '<div style="font-size:2rem;margin-bottom:10px">❌</div>' +
          '<p>Could not load gallery.</p>' +
          '<p style="font-size:.8rem;margin-top:6px;color:#aaa">' + err.message + '</p>' +
          '<button onclick="location.reload()" style="margin-top:14px;padding:9px 18px;' +
          'background:#2e8b57;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:.88rem">' +
          'Try Again</button></div>';
      });
  }

  function makeItem(image, idx) {
    var div = document.createElement('div');
    div.className = 'gallery-item reveal';
    div.setAttribute('role', 'listitem');
    div.setAttribute('tabindex', '0');
    div.setAttribute('data-index', idx);
    div.setAttribute('data-src', image.url);          // used by lightbox

    // Try thumbnail first; fall back to full URL on error
    var imgTag =
      '<img src="' + safe(image.thumbnail) + '" ' +
           'alt="' + safe(image.caption || 'Lake View Resort gallery image') + '" ' +
           'loading="lazy" ' +
           'onerror="this.onerror=null;this.src=\'' + safe(image.url) + '\'" />';

    div.innerHTML =
      imgTag +
      '<div class="gallery-overlay" aria-hidden="true">' +
        '<div class="gallery-overlay-icon">🔍</div>' +
      '</div>';

    return div;
  }

  // ── Helpers ──────────────────────────────────────────
  function html(icon, text, style) {
    return '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;' +
      (style||'color:#888') + '">' +
      '<div style="font-size:2.2rem;margin-bottom:12px">' + icon + '</div>' +
      '<p>' + text + '</p></div>';
  }

  function safe(s) {
    return s ? String(s).replace(/'/g, '&#39;').replace(/"/g, '&quot;') : '';
  }

})();
