export default function typewriter(node, { delay = 0, speed = 50 }) {
	const textNodes = getAllTextNodes(node);
	if (!textNodes.length) {
		throw new Error(`This transition only works on elements with text nodes`);
	}

	let totalLength = 0;
	const ranges = textNodes.map((textNode) => {
		const range = [totalLength, totalLength + textNode.textContent.length];
		totalLength += textNode.textContent.length;
		const text = textNode.textContent;
		textNode.textContent = '';
		return { textNode, range, text };
	});

	let currentRangeIndex = 0;
	function getCurrentRange(i) {
		while (ranges[currentRangeIndex].range[1] < i && currentRangeIndex < ranges.length) {
			const { textNode, text } = ranges[currentRangeIndex];
			textNode.textContent = text; // finish typing up the last node
			currentRangeIndex++;
		}
		return ranges[currentRangeIndex];
	}
	const duration = totalLength * speed;

	return {
		delay,
		duration,
		tick: (t) => {
			const progress = ~~(totalLength * t);
			const { textNode, range, text } = getCurrentRange(progress);
			const [start, end] = range;
			const textLength = ((progress - start) / (end - start)) * text.length;
			textNode.textContent = text.slice(0, textLength);
		}
	};
}

function getAllTextNodes(node) {
	if (node.nodeType === 3) {
		return [node];
	} else if (node.hasChildNodes()) {
		let list = [];
		for (let child of node.childNodes) {
			getAllTextNodes(child).forEach((textNode) => list.push(textNode));
		}
		return list;
	}
	return [];
}
