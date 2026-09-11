(function () {
  "use strict";

  var y = document.getElementById("anio");
  if (y) y.textContent = new Date().getFullYear();

  var doc = document.getElementById("doc");
  var docTxt = document.getElementById("doc-txt");
  if (doc && docTxt) {
    doc.addEventListener("change", function () {
      var n = doc.files ? doc.files.length : 0;
      if (n === 0) docTxt.textContent = "Adjuntar documento o foto";
      else if (n === 1) docTxt.textContent = doc.files[0].name;
      else docTxt.textContent = n + " archivos seleccionados";
    });
  }

  var form = document.getElementById("f-revision");
  if (!form) return;
  var msg = document.getElementById("f-msg");

  function err(campo, on) {
    var p = form.querySelector('[data-err="' + campo + '"]');
    if (p) p.classList.toggle("on", on);
    var c = document.getElementById(campo);
    if (c) c.setAttribute("aria-invalid", on ? "true" : "false");
  }

  function limpiaAlEditar(id) {
    var c = document.getElementById(id);
    if (!c) return;
    var ev = c.type === "checkbox" ? "change" : "input";
    c.addEventListener(ev, function () { err(id, false); });
  }
  ["nombre", "telefono", "email", "provincia", "rgpd"].forEach(limpiaAlEditar);

  function valida() {
    var fallos = [];
    var v = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ""; };

    if (v("nombre").length < 2) fallos.push("nombre");
    if (v("telefono").replace(/[^0-9]/g, "").length < 9) fallos.push("telefono");
    if (!v("provincia")) fallos.push("provincia");

    var mail = v("email");
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) fallos.push("email");

    var rgpd = document.getElementById("rgpd");
    if (rgpd && !rgpd.checked) fallos.push("rgpd");

    ["nombre", "telefono", "email", "provincia", "rgpd"].forEach(function (c) {
      err(c, fallos.indexOf(c) !== -1);
    });
    return fallos;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.className = "f-msg";
    msg.textContent = "";

    var fallos = valida();
    if (fallos.length) {
      var primero = document.getElementById(fallos[0]);
      if (primero) primero.focus();
      msg.className = "f-msg ko";
      msg.textContent = "Revise los campos marcados antes de enviar.";
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Enviando…";

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (r) {
        if (!r.ok) throw new Error("respuesta " + r.status);
        window.location.href = "/gracias/";
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = txt;
        msg.className = "f-msg ko";
        msg.innerHTML =
          'No hemos podido enviar el formulario. Llámenos directamente al <a href="tel:+34600000000">600 00 00 00</a>.';
      });
  });
})();
