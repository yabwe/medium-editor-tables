function selectElementContents(el, options) {
    options = options || {};

    var range = document.createRange(),
      sel = window.getSelection();
    range.selectNodeContents(el);

    if (options.collapse) {
        range.collapse(options.collapse === true);
    }

    sel.removeAllRanges();
    sel.addRange(range);
}
