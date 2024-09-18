window.onload = function () {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // Kích thước canvas
  canvas.width = 800;
  canvas.height = 600;

  // Danh sách các node với vị trí và bán kính
  const nodes = [
    { x: 100, y: 100, radius: 10 },
    { x: 200, y: 150, radius: 10 },
    { x: 300, y: 200, radius: 10 },
    { x: 400, y: 250, radius: 10 },
    { x: 500, y: 300, radius: 10 },
  ];

  // Danh sách các liên kết giữa các node
  const links = [];

  let isDragging = false;
  let selectedNode = null;
  let offsetX, offsetY;
  let selectedNodeForLink = null; // Node đầu tiên để vẽ liên kết

  // Vẽ các node và các liên kết
  function drawNodesAndLinks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ lại

    // Vẽ các liên kết trước
    links.forEach((link) => {
      drawArrow(link.from, link.to);
    });

    // Vẽ các node
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2); // Vẽ hình tròn
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.stroke();
    });
  }

  // Vẽ một mũi tên liên kết giữa hai node
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

  // Kiểm tra xem điểm (x, y) có nằm trong hình tròn hay không
  function isInsideNode(x, y, node) {
    const dx = x - node.x;
    const dy = y - node.y;
    return Math.sqrt(dx * dx + dy * dy) < node.radius;
  }

  // Xử lý sự kiện chuột nhấn
  canvas.addEventListener("mousedown", function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (e.button === 2) {
      // Nếu chuột phải
      // Kiểm tra nếu chuột nhấn vào bất kỳ node nào để kéo thả
      nodes.forEach((node) => {
        if (isInsideNode(mouseX, mouseY, node)) {
          isDragging = true;
          selectedNode = node;
          offsetX = mouseX - node.x;
          offsetY = mouseY - node.y;
        }
      });
    } else if (e.button === 0) {
      // Nếu chuột trái
      // Chọn node để vẽ liên kết
      nodes.forEach((node) => {
        if (isInsideNode(mouseX, mouseY, node)) {
          if (selectedNodeForLink === null) {
            selectedNodeForLink = node; // Chọn node đầu tiên
          } else {
            // Nếu đã chọn node đầu tiên, tạo liên kết từ node đầu đến node thứ hai
            links.push({ from: selectedNodeForLink, to: node });
            selectedNodeForLink = null; // Reset lựa chọn
            drawNodesAndLinks(); // Vẽ lại với liên kết mới
          }
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

      drawNodesAndLinks(); // Vẽ lại canvas với liên kết cập nhật
    }
  });

  // Xử lý sự kiện chuột nhả
  canvas.addEventListener("mouseup", function (e) {
    if (e.button === 2) {
      // Khi nhả chuột phải
      isDragging = false;
      selectedNode = null;
    }
  });

  // Tắt menu chuột phải mặc định
  canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Vẽ lần đầu
  drawNodesAndLinks();
};
