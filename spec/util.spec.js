describe('#getSelectionText', function () {
  it('should return the element selected text', function () {
    var div = document.createElement('div');
    div.innerHTML = 'Hello, world!';
    document.body.appendChild(div);
    selectElementContents(div);
    expect(getSelectionText(document)).toEqual(div.innerHTML);
    document.body.removeChild(div);
  });
});

describe('#getSelectionStart', function () {
  it('should return the selection node', function () {
    var div = document.createElement('div');
    div.innerHTML = 'Hello, world!';
    document.body.appendChild(div);
    selectElementContents(div);
    expect(getSelectionStart(document)).toEqual(div);
    document.body.removeChild(div);
  });
});
