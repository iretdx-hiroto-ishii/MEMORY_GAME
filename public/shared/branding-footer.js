(function () {
  fetch('/branding.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('branding.json not found');
      }
      return response.json();
    })
    .then(function (branding) {
      document.querySelectorAll('[data-app-copyright]').forEach(function (el) {
        el.textContent =
          '\u00A9 ' + branding.copyrightStartYear + ' ' + branding.operatorName;
      });
    })
    .catch(function (error) {
      console.warn('[branding-footer]', error);
    });
})();
