const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const nodeList = document.getElementById("nodeList");

const fromNodeSelect = document.getElementById("fromNodeSelect");
const toNodeSelect = document.getElementById("toNodeSelect");
const linksTable = document.querySelector("#linksTable tbody");
const addLinkButton = document.getElementById("addLinkButton");

const nodes = [
	{ name: "Con", isInCanvas: false },
	{ name: "Cac", isInCanvas: false },
	{ name: "Tao", isInCanvas: false },
	{ name: "Ne", isInCanvas: false }
]; // Danh sách các node {name, isInCanvas (bool)} chưa được thêm vào canvas
const canvasNodes = {}; // Danh sách các node: { tên: x, y, bán kính, tên }
const links = []; // Danh sách các liên kết giữa các node

// Kéo thả
let isDragging = false;
let selectedNode = null;

// Kiểm tra xem điểm (x, y) có nằm trong hình tròn hay không
function isInsideNode(x, y, node) {
	const dx = x - node.x;
	const dy = y - node.y;
	return Math.sqrt(dx * dx + dy * dy) < node.radius;
}

function addNode(node) {
	nodes.push(node);
	updateNodeList();
}

function addCanvasNode(name) {
	const radius = 10; // Bán kính mặc định của node
	const pixels = 50; // Các node cách nhau ít nhất 50px
	let newNode;

	// Hàm để kiểm tra xem node mới có cách đủ xa các node khác không
	function isNodeTooClose(newNode) {
		for (let key in canvasNodes) {
			if (canvasNodes.hasOwnProperty(key)) {
				const dx = canvasNodes[key].x - newNode.x;
				const dy = canvasNodes[key].y - newNode.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < canvasNodes[key].radius + newNode.radius + pixels) { // Cách nhau ít nhất 50px
					return true;
				}
			}
		}
		return false;
	}

	// Tạo vị trí ngẫu nhiên cho đến khi tìm được vị trí không quá gần các node khác
	do {
		const x = Math.random() * (canvas.width - 2 * radius) + radius;
		const y = Math.random() * (canvas.height - 2 * radius) + radius;

		newNode = { x: x, y: y, radius: radius, name: name };
	} while (isNodeTooClose(newNode));

	// Thêm node mới vào danh sách nodes
	canvasNodes[name] = newNode;

	// Vẽ lại canvas với node mới
	updateCanvas();
}

function addLink(link) {
	links.push(link);
	updateLinksTable();
	updateCanvas();
}

function removeFromCanvas(nodeName) {
	delete canvasNodes[nodeName];
	updateCanvas();
}

// Vẽ các node và các liên kết
function updateCanvas() {

	// Vẽ node
	function drawNode(node) {
		ctx.beginPath();
		ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2); // Vẽ hình tròn
		ctx.fillStyle = "blue";
		ctx.fill();
		ctx.stroke();

		// Hiển thị tên của node
		ctx.font = "12px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(node.name, node.x, node.y + node.radius + 15); // Hiển thị tên ở dưới node
	}

	// Vẽ liên kết
	function drawArrow(fromNode, toNode) {
		const headLength = 15; // Độ dài của mũi tên
		const dx = toNode.x - fromNode.x;
		const dy = toNode.y - fromNode.y;
		const angle = Math.atan2(dy, dx);

		// Vẽ đường thẳng
		ctx.beginPath();
		ctx.moveTo(fromNode.x, fromNode.y);
		ctx.lineTo(toNode.x, toNode.y);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();

		// Vẽ mũi tên
		ctx.beginPath();
		ctx.moveTo(toNode.x, toNode.y);
		ctx.lineTo(
			toNode.x - headLength * Math.cos(angle - Math.PI / 6),
			toNode.y - headLength * Math.sin(angle - Math.PI / 6)
		);
		ctx.lineTo(
			toNode.x - headLength * Math.cos(angle + Math.PI / 6),
			toNode.y - headLength * Math.sin(angle + Math.PI / 6)
		);
		ctx.lineTo(toNode.x, toNode.y);
		ctx.fillStyle = "black";
		ctx.fill();
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ lại

	fromNodeSelect.innerHTML = ''; // Xóa các option cũ
	toNodeSelect.innerHTML = ''; // Xóa các option cũ

	// Cập nhật node
	Object.values(canvasNodes).forEach((node) => {
		drawNode(node);

		// Thêm vào dropdown để chọn node
		const fromOption = document.createElement("option");
		fromOption.value = node.name;
		fromOption.textContent = node.name;
		fromNodeSelect.appendChild(fromOption);

		const toOption = document.createElement("option");
		toOption.value = node.name;
		toOption.textContent = node.name;
		toNodeSelect.appendChild(toOption);
	});

	// Cập nhật liên kết
	links.forEach((link) => {
		const fromNode = canvasNodes[link.from];
		const toNode = canvasNodes[link.to];
		drawArrow(fromNode, toNode);
	});
}

// Hàm cập nhật danh sách node trong sidebar và dropdown
function updateNodeList() {
	nodeList.innerHTML = ''; // Xóa danh sách cũ

	function updateNodeState(node, listItem, toggleInCanvasButton) {
		if (node.isInCanvas == false) {
			listItem.classList.remove("added");
			toggleInCanvasButton.textContent = "+";
			toggleInCanvasButton.onclick = function (ev) {
				// Tạo và thêm node mới vào canvas
				addCanvasNode(node.name);  // Sinh vị trí ngẫu nhiên
				node.isInCanvas = true;
				updateNodeState(node, listItem, toggleInCanvasButton);
			};
		} else {
			listItem.classList.add("added");
			toggleInCanvasButton.textContent = "x";
			toggleInCanvasButton.onclick = function (ev) {
				// Loại node khỏi canvas
				removeFromCanvas(node.name);
				node.isInCanvas = false;
				updateNodeState(node, listItem, toggleInCanvasButton);
			};
		}
	}

	nodes.forEach((node) => {
		// Tạo một thẻ chứa tên node
		const listItem = document.createElement("li");
		listItem.textContent = node.name;
		const toggleInCanvasButton = document.createElement("button");
		updateNodeState(node, listItem, toggleInCanvasButton);
		listItem.appendChild(toggleInCanvasButton);
		nodeList.appendChild(listItem);
	});
}

// Hàm cập nhật bảng liên kết
function updateLinksTable() {
	linksTable.innerHTML = ''; // Xóa các hàng cũ

	links.forEach((link, index) => {
		const row = document.createElement("tr");

		const fromCell = document.createElement("td");
		fromCell.textContent = link.from;
		row.appendChild(fromCell);

		const toCell = document.createElement("td");
		toCell.textContent = link.to;
		row.appendChild(toCell);

		const actionCell = document.createElement("td");
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete";
		deleteButton.onclick = function () {
			links.splice(index, 1); // Xóa liên kết khỏi danh sách
			updateLinksTable();
			updateCanvas();
		};
		actionCell.appendChild(deleteButton);
		row.appendChild(actionCell);

		linksTable.appendChild(row);
	});
}

window.onload = function () {
	// Kích thước canvas
	canvas.width = 800;
	canvas.height = 600;

	// Biến tạm lưu vị trí
	let offsetX = 0;
	let offsetY = 0;

	// Xử lý sự kiện chuột nhấn
	canvas.addEventListener("mousedown", function (e) {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		// Nếu chuột trái => di chuyển node
		if (e.button === 0) {
			Object.values(canvasNodes).forEach((node) => {
				if (isInsideNode(mouseX, mouseY, node)) {
					isDragging = true;
					selectedNode = node;
					offsetX = mouseX - node.x;
					offsetY = mouseY - node.y;
				}
			});
		}
	});

	// Xử lý sự kiện chuột di chuyển
	canvas.addEventListener("mousemove", function (e) {
		if (isDragging) {
			const rect = canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			// Di chuyển node theo chuột
			selectedNode.x = mouseX - offsetX;
			selectedNode.y = mouseY - offsetY;

			updateCanvas(); // Vẽ lại canvas với liên kết cập nhật
		}
	});

	// Xử lý sự kiện chuột nhả
	canvas.addEventListener("mouseup", function (e) {
		if (e.button === 0) {
			// Khi nhả chuột phải
			isDragging = false;
			selectedNode = null;
		}
	});

	// Tắt menu chuột phải mặc định
	canvas.addEventListener("contextmenu", function (e) {
		e.preventDefault();
	});

	// Hàm cho nút thêm liên kết mới
	addLinkButton.onclick = function () {
		const fromNodeName = fromNodeSelect.value;
		const toNodeName = toNodeSelect.value;

		if (fromNodeName && toNodeName && fromNodeName !== toNodeName) {
			addLink({ from: fromNodeName, to: toNodeName });
		}
	};

	// Vẽ lần đầu
	updateNodeList();
	updateLinksTable();
	updateCanvas();
};
