// Vẽ đường nối giữa hai điểm được xác định bởi 4 tham số
const drawLine = (x1, y1, x2, y2, ar) => {
    if (dist[Number(ar[0])][Number(ar[1])] !== Infinity) {
        document.getElementById(arr[0]).style.backgroundColor = "#333"; 
        document.getElementById(arr[1]).style.backgroundColor = "#333";
        return;
    }

    const len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    // Chiều dài được tính bằng tọa độ.
    const slope = x2 - x1 ? (y2 - y1) / (x2 - x1) : y2 > y1 ? 90 : -90; 

    dist[Number(ar[0])][Number(ar[1])] = Math.round(len / 10);
    dist[Number(ar[1])][Number(ar[0])] = Math.round(len / 10);

    const line = document.createElement("div");
    line.id =
        Number(ar[0]) < Number(ar[1])
            ? `line-${ar[0]}-${ar[1]}`
            : `line-${ar[1]}-${ar[0]}`;
    line.classList.add("line");
    line.style.width = `${len}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;

    let p = document.createElement("p"); 
    p.classList.add("edge-weight"); 
    p.innerText = Math.round(len / 10); 
    p.contentEditable = "true"; 
    p.inputMode = "numeric"; 
    p.addEventListener("blur", (e) => {
        const newWeight = Number(e.target.innerText.trim());

        if (isNaN(newWeight)) {
            alert("Enter a valid and positive edge weight");

            const edgeIds = e.target.closest(".line").id.split("-").slice(1).map(Number);
            const n1 = edgeIds[0];
            const n2 = edgeIds[1];

            e.target.innerText = dist[n1][n2];
            e.target.style.backgroundColor = "transparent";
            e.target.focus();
            e.preventDefault();

            return;
        }

        const edgeIds = e.target.closest(".line").id.split("-").slice(1).map(Number);
        const n1 = edgeIds[0];
        const n2 = edgeIds[1];

        dist[n1][n2] = newWeight;
        dist[n2][n1] = newWeight;

        e.target.textContent = String(newWeight);
        e.target.style.backgroundColor = "transparent";
    });

    line.addEventListener("contextmenu", (e) => {
        e.preventDefault(); 
        removeEdge(line.id);
      });

    line.style.transform = `rotate(${x1 > x2 ? Math.PI + Math.atan(slope) : Math.atan(slope)
        }rad)`;

    p.style.transform = `rotate(${x1 > x2 ? (Math.PI + Math.atan(slope)) * -1 : Math.atan(slope) * -1
        }rad)`;

    line.append(p);
    blocks.appendChild(line);
    document.getElementById(arr[0]).style.backgroundColor = "#333";
    document.getElementById(arr[1]).style.backgroundColor = "#333";
};
let totalWeight = 0; 

const findMinimumSpanningTree = (el) => {
    if (!isConnected()) {
         return;
    }
    resetPathAndLinesStyles();
    let visited = new Array(cnt).fill(false);
    let parent = new Array(cnt).fill(-1);
    let key = new Array(cnt).fill(Infinity);
    let source = 0;
    
    key[source] = 0;
    for (let count = 0; count < cnt - 1; count++) {
        let u = minKey(key, visited);
        visited[u] = true;

        for (let v = 0; v < cnt; v++) {
            if (dist[u][v] && visited[v] === false && dist[u][v] < key[v]) {
                parent[v] = u;
                key[v] = dist[u][v];
            }
        }
    }

    document.getElementById(source).style.backgroundColor = "grey";
    for (let i = 0; i < cnt; i++) {
        if (i !== source) {
            indicateEdge(parent[i], i);
        }
    }

    indicatePath(parent, source);
};

const minKey = (key, visited) => {
    let min = Infinity;
    let minIndex = -1;

    for (let v = 0; v < cnt; v++) {
        if (visited[v] === false && key[v] < min) {
            min = key[v];
            minIndex = v;
        }
    }

    return minIndex;
};

const indicateEdge = async (src, dest) => {
    let edgeId = `line-${Math.min(src, dest)}-${Math.max(src, dest)}`;
    let edge = document.getElementById(edgeId);

    if (edge && edge.style.backgroundColor !== "aqua") {
        await wait(1000);
        edge.style.backgroundColor = "aqua";
        edge.style.height = "8px";
        totalWeight += dist[src][dest]; 
    }
};

const indicatePath = async (parentArr, src) => {
    document.getElementsByClassName("path")[0].innerHTML = "";
    for (let i = 0; i < cnt; i++) {
        let p = document.createElement("p");
        await printPath(parentArr, i, p);
        if (i + 1 == cnt) {
            p.innerText += "Trọng số: " + totalWeight;
        }
    }
};

const printPath = async (parent, j, el_p) => {
    if (parent[j] === -1) return;
    await printPath(parent, parent[j], el_p);

    document.getElementsByClassName("path")[0].style.padding = "1rem";
    document.getElementsByClassName("path")[0].appendChild(el_p);

    if (j === parent[j]) {
        document.getElementById(j).style.backgroundColor = "grey";
    } else if (j < parent[j]) {
        let tmp = document.getElementById(`line-${j}-${parent[j]}`);
        await colorEdge(tmp);
    } else {
        let tmp = document.getElementById(`line-${parent[j]}-${j}`);
        await colorEdge(tmp);
    }
};

const resetDrawingArea = () => {
    blocks.innerHTML = "";

    const p = document.createElement("p");
    p.classList.add("click-instruction");
    p.innerHTML = "Click để tạo nút";

    blocks.appendChild(p);
    document.getElementById("add-edge-enable").disabled = true;
    document.getElementById("fix-length").disabled = true;
    document.querySelector(".reset-btn").disabled = true;
    document.querySelector(".run-btn").disabled = true;
    document.getElementsByClassName("path")[0].style.padding = "0rem";
    document.getElementsByClassName("path")[0].innerHTML = "";

    cnt = 0;
    dist = [];
    addEdge = false;
    countAddEdge = 0;
    totalWeight = 0; 
};

sessionStorage.setItem('currentPage', 'prim.html');