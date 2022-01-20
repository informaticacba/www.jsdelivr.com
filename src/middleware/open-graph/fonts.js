const opentype = require('opentype.js');

module.exports = class FontsProcessor {
	constructor () {
		/**
		 * @type {Map<string, any>}
		 * @private
		 */
		this._fonts = new Map();
	}

	_getFont (fontFamily) {
		if (!this._fonts.has(fontFamily)) {
			throw new Error('font is not loaded');
		}

		return this._fonts.get(fontFamily);
	}

	addFont (alias, fontPath) {
		// todo: don't forget about loadSync here
		let font = opentype.loadSync(fontPath);

		this._fonts.set(alias, font);
	}

	/**
	 * Computes the input width and height for the specific font family and font size
	 *
	 * @param {string} input
	 * @param {string} fontFamily
	 * @param {number} fontSize
	 * @return {number}
	 */
	computeWidth (input, fontFamily, fontSize) {
		// Uses algorithm based on https://developer.tizen.org/community/tip-tech/working-fonts-using-opentype.js
		let font = this._getFont(fontFamily);
		let glyphs = font.stringToGlyphs(input);
		let scale = 1 / font.unitsPerEm * fontSize;
		let width = 0;

		for (let i = 0; i < glyphs.length; i++) {
			let glyph = glyphs[i];

			if (glyph.advanceWidth) {
				width += glyph.advanceWidth * scale;
			}

			if (i < glyphs.length - 1) {
				width += font.getKerningValue(glyph, glyphs[i + 1]) * scale;
			}
		}

		return width;
	}

	/**
	 * @param {string} word
	 * @param {string} fontFamily
	 * @param {number} fontSize
	 * @param {number} maxWidth
	 * @return {string[]}
	 */
	breakWord (word, fontFamily, fontSize, maxWidth) {
		let letters = word.split('');

		let piece = '';
		let pieces = [];
		let pieceWidth = 0;
		let breakCharWidth = this.computeWidth('-', fontFamily, fontSize);

		for (let l of letters) {
			let charWidth = this.computeWidth(l, fontFamily, fontSize);

			if (pieceWidth + charWidth > maxWidth - breakCharWidth) {
				pieces.push(piece + '-');
				piece = '';
				pieceWidth = 0;
			}

			piece += l;
			pieceWidth += charWidth;
		}

		pieces.push(piece);

		return pieces;
	}

	/**
	 * @param {string} input
	 * @param {string} fontFamily
	 * @param {number} fontSize
	 * @param {number} maxWidth
	 */
	wrap (input, fontFamily, fontSize, maxWidth) {
		let chunks = input.replace(/\r\n|\n/, ' ').match(/[^\s-]+?-\b|\S+|\s+|\r\n?|\n/g);

		let lines = [];
		let curLine = [];
		let curLineWidth = 0;

		while (chunks.length > 0) {
			let word = chunks.shift();
			let wordWidth = this.computeWidth(word, fontFamily, fontSize);

			if (wordWidth > maxWidth) {
				let parts = this.breakWord(word, fontFamily, fontSize, maxWidth);
				chunks.unshift(...parts);
			} else if (curLineWidth + wordWidth < maxWidth) {
				curLine.push(word);
				curLineWidth += wordWidth;
			} else {
				chunks.unshift(word);
				lines.push(curLine);
				curLine = [];
				curLineWidth = 0;
			}
		}

		lines.push(curLine);

		return lines.map(l => l.join('').trim());
	}
};
