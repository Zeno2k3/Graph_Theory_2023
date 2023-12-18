const drawLine = (x1, y1, x2, y2, ar) => {
    if (dist[Number(ar[0])][Number(ar[1])] !== Infinity) {
        document.getElementById(arr[0]).style.backgroundColor = "#333"; 
        document.getElementById(arr[1]).style.backgroundColor = "#333";
        return;
    }

    const len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
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

        if (isNaN(newWeight) || newWeight < 0) {
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

const findShortestPath = (el) => {
    if (!isConnected()) {
        return;
    }
    resetPathAndLinesStyles();
    let visited = [];
    let unvisited = [];

    let source = Number(el.previousElementSibling.value);

    if (source >= cnt || isNaN(source)) {
        alert("Invalid source");
        return;
    }

    document.getElementById(source).style.backgroundColor = "grey";

    let parent = [];
    parent[source] = -1;
    visited = [];
    for (i = 0; i < cnt; i++) unvisited.push(i);

    let cost = [];
    for (i = 0; i < cnt; i++) {
        i === source
            ? null
            : dist[source][i]
                ? (cost[i] = dist[source][i])
                : (cost[i] = Infinity);
    }
    cost[source] = 0;
    let minCost = [];
    minCost[source] = 0;

    while (unvisited.length) {
        let mini = cost.indexOf(Math.min(...cost));
        visited.push(mini);
        unvisited.splice(unvisited.indexOf(mini), 1);

        for (j of unvisited) {
            if (j === mini) continue;
            if (cost[j] > dist[mini][j] + cost[mini]) {
                minCost[j] = dist[mini][j] + cost[mini];
                cost[j] = dist[mini][j] + cost[mini];
                parent[j] = mini;
            } else {
                minCost[j] = cost[j];
            }
        }
        cost[mini] = Infinity;
    }

    for (i = 0; i < cnt; i++)
        parent[i] === undefined ? (parent[i] = source) : null;
    indicatePath(parent, source);
};

const indicatePath = async (parentArr, src) => {
    document.getElementsByClassName("path")[0].innerHTML = "";
    for (let i = 0; i < cnt; i++) {
        let p = document.createElement("p");
        p.innerText = "Node " + i + " --> " + src;
        await printPath(parentArr, i, p);
        const pathLength = calculatePathLength(parentArr, i);
        p.innerText = p.innerText + "  L=" + pathLength;
    }
};

const printPath = async (parent, j, el_p) => {
    if (parent[j] === -1) return;
    const pathLength = calculatePathLength(parent, j);

    await printPath(parent, parent[j], el_p);
    el_p.innerText = `${el_p.innerText} ${j}`;

    document.getElementsByClassName("path")[0].style.padding = "1rem";
    document.getElementsByClassName("path")[0].appendChild(el_p);

    if (j < parent[j]) {
        let tmp = document.getElementById(`line-${j}-${parent[j]}`);
        await colorEdge(tmp);
    } else {
        let tmp = document.getElementById(`line-${parent[j]}-${j}`);
        await colorEdge(tmp);
    }
};

const calculatePathLength = (parent, j) => {
    let length = 0;
    while (parent[j] !== -1) {
        length += dist[j][parent[j]];
        j = parent[j];
    }
    return length;
};

const resetDrawingArea = () => {
    blocks.innerHTML = "";

    const p = document.createElement("p");
    p.classList.add("click-instruction");
    p.innerHTML = "Click to create node";

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
}; 

sessionStorage.setItem('currentPage', 'dijkstra.html');
