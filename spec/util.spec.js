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

        describe('#isInsideElementOfTag', function () {
            it('should return false when node is invalid', function () {
                expect(isInsideElementOfTag(undefined, 'p')).toBe(false);
            });

            it('should return true when parent element has specified tag', function () {
                var parentEl = document.createElement('div'),
                    childEl = document.createElement('p');

                parentEl.appendChild(childEl);
                document.body.appendChild(parentEl);
                expect(isInsideElementOfTag(childEl, 'div')).toBe(true);
                document.body.removeChild(parentEl);
            });

            it('should return true when parent element does not have specified tag', function () {
                var parentEl = document.createElement('div'),
                    childEl = document.createElement('p');

                parentEl.appendChild(childEl);
                document.body.appendChild(parentEl);
                expect(isInsideElementOfTag(childEl, 'span')).toBe(false);
                document.body.removeChild(parentEl);
            });
        });
    });
});
