let blocks = document.getElementsByClassName("drawing-area")[0];
let addEdge = false; 
let cnt = 0; 
let dist; 
let countAddEdge = 0;
let changeLength = false;

const addEdges = () => {
    addEdge = true;
    document.getElementById("add-edge-enable").disabled = true;
    document.getElementById("fix-length").disabled = false;
    document.getElementsByClassName("run-btn")[0].disabled = false;
    dist = new Array(cnt + 1)
        .fill(Infinity)
        .map(() => new Array(cnt + 1).fill(Infinity));
};

const fixLength = () => {
    if (!changeLength)
        changeLength = true;
    else
        changeLength = false;
}

let arr = [];

const appendBlock = (x, y) => {
    document.querySelector(".reset-btn").disabled = false;
    if (!countAddEdge) {
        document.getElementById("add-edge-enable").disabled = false;
        countAddEdge++;
    }
    document.querySelector(".click-instruction").style.display = "none";

    const block = document.createElement("div");
    block.classList.add("block");
    block.style.top = `${y}px`;
    block.style.left = `${x}px`;
    block.style.transform = `translate(-50%,-50%)`;
    
    block.id = cnt;

    block.innerText = cnt++;
    block.id = cnt - 1;

    block.addEventListener("click", (e) => {
        e.stopPropagation();

        if (!addEdge) return;

        block.style.backgroundColor = "coral";
        arr.push(block.id); 

        if (arr.length === 2) {
            drawUsingId(arr);
            arr = [];
        }
    });
    block.addEventListener("contextmenu", (e) => {
        if (isNodeSatisfyingConditions(block.id)) {
            e.preventDefault();
            removeNode(block.id);
        }
    });

    blocks.appendChild(block);
};

const isNodeSatisfyingConditions = (nodeId) => {
    let deleteVertice1 = cnt - 1;
    let deleteVertice2 = cnt - 1;
    let deleteVertice3 =  parseInt(nodeId) - 1;
    while (deleteVertice1 > deleteVertice3) {
        const higherOrderEdges = document.querySelectorAll(`.line[id*="${deleteVertice1}-"]`);
        if (higherOrderEdges.length !== 0) {
            deleteVertice1--;
        }
        if(deleteVertice1 !== deleteVertice2)
            return false; 
        deleteVertice1--;
        deleteVertice2--;
    }
    return true;
};
const removeNode = (nodeId) => {
    const nodeIndex = arr.indexOf(nodeId);
    arr.splice(nodeIndex, 1);

    const nodeToRemove = document.getElementById(nodeId);
    nodeToRemove.remove();

    removeEdgesOfNode(nodeId);

    updateNodeOrder();
    cnt--;
};

const updateNodeOrder = () => {
    const nodes = document.getElementsByClassName("block");
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].innerText = i;
        nodes[i].id = i;
    }
};

const removeEdgesOfNode = (nodeId) => {
    const edgesToRemove = document.querySelectorAll(`.line[id*="${nodeId}-"]`);
    edgesToRemove.forEach((edge) => {
        const [start, end] = edge.id.split("-").slice(1).map(Number);
        dist[start][end] = Infinity;
        dist[end][start] = Infinity;
        edge.remove();
    });
};

blocks.addEventListener("click", (e) => {
    if (addEdge) {
        if (changeLength)
            return;
        dist.push(new Array(cnt + 2).fill(Infinity));

        dist.forEach(row => row.push(Infinity));

        dist[cnt + 1][cnt + 1] = 0;
    }
    if (cnt > 15) {
        alert("cannot add more than 15 vertices");
        return;
    }
    appendBlock(e.x, e.y); 
});

document.addEventListener("DOMContentLoaded", function () {
    const colorButton = document.getElementById("fix-length");
  
    colorButton.addEventListener("click", function () {
      const isSelected = colorButton.classList.contains("selected");
  
      if (isSelected) {
        colorButton.classList.remove("selected");
        colorButton.classList.add("default");
      } else {
        colorButton.classList.remove("default");
        colorButton.classList.add("selected");
      }
    });
  
    colorButton.addEventListener("mouseenter", function () {
      if (colorButton.hasAttribute("disabled")) {
        colorButton.classList.add("disabled");
      }
    });
  
    colorButton.addEventListener("mouseleave", function () {
      if (colorButton.hasAttribute("disabled")) {
        colorButton.classList.remove("disabled");
      }
    });
});

const removeEdge = (edgeId) => {
    const [start, end] = edgeId.split("-").slice(1).map(Number);
  
    const edgeToRemove = document.getElementById(edgeId);
    edgeToRemove.remove();
  
    dist[start][end] = Infinity;
    dist[end][start] = Infinity;
};

const drawUsingId = (ar) => {
    if (ar[0] === ar[1]) {
        document.getElementById(arr[0]).style.backgroundColor = "#333";
        arr = [];
        return;
    }
    x1 = Number(document.getElementById(ar[0]).style.left.slice(0, -2));
    y1 = Number(document.getElementById(ar[0]).style.top.slice(0, -2));
    x2 = Number(document.getElementById(ar[1]).style.left.slice(0, -2));
    y2 = Number(document.getElementById(ar[1]).style.top.slice(0, -2));
    drawLine(x1, y1, x2, y2, ar);
};

const isConnected = () => {
    let visited = new Array(cnt).fill(false);
    dfs(0, visited); 

    for (let i = 0; i < cnt; i++) {
        if (!visited[i]) {
            alert("The graph is not connected!");
            return false;
        }
    }
    return true;
};

const dfs = (v, visited) => {
    visited[v] = true;
    for (let i = 0; i < cnt; i++) {
        if (dist[v][i] !== Infinity && !visited[i]) {
            dfs(i, visited);
        }
    }
};

const colorEdge = async (el) => {
    if (el.style.backgroundColor !== "aqua") {
        await wait(1000);
        el.style.backgroundColor = "aqua";
        el.style.height = "8px";
    }
};

const clearScreen = () => {
    document.getElementsByClassName("path")[0].innerHTML = "";
    let nodes = document.getElementsByClassName("block");
    for (node of nodes) {
        node.remove();
    }

    let lines = document.getElementsByClassName("line");
    for (line of lines) {
        line.style.backgroundColor = "#EEE";
        line.style.height = "5px";
    }
};

const wait = async (t) => {
    let pr = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("done!");
        }, t);
    });
    res = await pr;
};

function goInstruction() {
    window.location.href = "instruction.html";
}

function goHome() {
    window.location.href = "index.html";
}

const resetPathAndLinesStyles = () => {
    document.getElementsByClassName("path")[0].innerHTML = "";
    let lines = document.getElementsByClassName("line");
    for (line of lines) {
        line.style.backgroundColor = "#EEE";
        line.style.height = "5px";
    }
};
