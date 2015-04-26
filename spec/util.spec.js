describe('Util TestCase', function () {
  describe('Selection', function () {
    beforeEach(function () {
      this.div = document.createElement('div');
      this.div.innerHTML = 'Hello, world!';
      document.body.appendChild(this.div);
      selectElementContents(this.div);
    });

    afterEach(function () {
      document.body.removeChild(this.div);
    });

    describe('#getSelectionText', function () {
      it('should return the element selected text', function () {
        expect(getSelectionText(document)).toEqual(this.div.innerHTML);
      });
    });

    describe('#getSelectionStart', function () {
      it('should return the selection node', function () {
        expect(getSelectionStart(document)).toEqual(this.div);
      });
    });
  });
});
