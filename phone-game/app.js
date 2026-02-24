const track = document.getElementById("track");
const swarm = document.getElementById("swarm");
const player = document.getElementById("player");
const counter = document.getElementById("crowdCount");
const gateRows = [...document.querySelectorAll(".gate-row")];

let crowd = 48;
let lane = 0;
const members = Array.from({ length: 190 }, (_, i) => ({
  x: Math.random() * 0.35 - 0.175,
  y: 1 - i * 0.006,
  active: i < crowd,
}));

function placeRows() {
  gateRows.forEach((row) => {
    row.style.top = `${row.dataset.y}%`;
  });
}

function updateCounter() {
  counter.textContent = crowd;
}

function applyGate(row) {
  const gate = [...row.querySelectorAll(".gate")][lane < 0 ? 0 : 1];
  const value = Number(gate.dataset.value);
  const effect = gate.dataset.effect;

  if (effect === "multiply") crowd = Math.min(190, crowd * value);
  if (effect === "add" || effect === "bonus") crowd = Math.min(190, crowd + value);
  if (effect === "subtract") crowd = Math.max(5, crowd - value);

  members.forEach((member, i) => {
    member.active = i < crowd;
  });

  row.style.opacity = "0.45";
  updateCounter();
}

function render() {
  swarm.innerHTML = "";

  const width = track.clientWidth;
  const height = track.clientHeight;

  members.forEach((member) => {
    if (!member.active) return;

    member.y -= 0.0024;
    if (member.y < 0.08) member.y = 0.98;

    member.x += (lane - member.x) * 0.06 + (Math.random() - 0.5) * 0.006;

    const dot = document.createElement("span");
    dot.className = "runner";
    dot.style.left = `${width * (0.5 + member.x)}px`;
    dot.style.top = `${height * member.y}px`;
    swarm.appendChild(dot);
  });

  const currentY = members[0].y * 100;
  gateRows.forEach((row) => {
    if (!row.dataset.used && currentY < Number(row.dataset.y) + 2) {
      row.dataset.used = "1";
      applyGate(row);
    }
  });

  requestAnimationFrame(render);
}

function setLaneFromTouch(clientX) {
  const rect = track.getBoundingClientRect();
  const ratio = (clientX - rect.left) / rect.width;
  lane = ratio < 0.5 ? -0.18 : 0.18;
  player.style.left = `${ratio * 100}%`;
}

track.addEventListener("mousemove", (event) => setLaneFromTouch(event.clientX));
track.addEventListener("touchmove", (event) => {
  const t = event.touches[0];
  if (t) setLaneFromTouch(t.clientX);
});

placeRows();
updateCounter();
render();
