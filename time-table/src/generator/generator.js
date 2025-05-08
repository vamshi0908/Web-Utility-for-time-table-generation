const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Mahindra University time slots and lunch boundary
const TIME_SLOTS = [
  "08:25 – 09:20 a.m.",
  "09:25 – 10:20 a.m.",
  "10:25 – 11:20 a.m.",
  "11:25 – 12:20 p.m.",    // Morning end
  "12:35 – 01:30 p.m.",    // Lunch (no classes allowed)
  "01:35 – 02:30 p.m.",    // Afternoon start
  "02:35 – 03:30 p.m.",
  "03:35 – 04:30 p.m.",
  "04:35 – 05:30 p.m.",
  "05:35 – 06:30 p.m."
];

// Predefined classrooms
const ROOMS = [
  // ELT rooms
  "ELT-1","ELT-2","ELT-3","ELT-4","ELT-5","ELT-6","ELT-7",
  // ECR rooms
  ...Array.from({ length: 18 }, (_, i) => `ECR-${i+1}`)
];

// Genetic Algorithm helpers
function generatePopulation(instances, days, slotsPerDay, popSize) {
  const pop = [];
  for (let p = 0; p < popSize; p++) {
    const indiv = {};
    for (const inst of instances) {
      const key = `${inst.teacher}_${inst.subject}_${inst.sections.join(",")}`;
      const slots = [];
      // split morning/afternoon
      const mornSlots = [0,1,2,3];
      const aftSlots = slotsPerDay[0] > 5 ? [5,6,7,8,9].slice(0, slotsPerDay[0]-5) : [5];
      const half = Math.floor(inst.numLectures / 2);
      // morning picks
      for (let m = 0; m < half; m++) {
        const d = Math.floor(Math.random() * days);
        const s = mornSlots[Math.floor(Math.random() * mornSlots.length)];
        slots.push([d, s]);
      }
      // afternoon picks
      for (let m = half; m < inst.numLectures; m++) {
        const d = Math.floor(Math.random() * days);
        const s = aftSlots[Math.floor(Math.random() * aftSlots.length)];
        slots.push([d, s]);
      }
      indiv[key] = slots;
    }
    pop.push(indiv);
  }
  return pop;
}

function fitness(indiv, teachers, sections) {
  const tSched = {}; const sSched = {};
  teachers.forEach(t => tSched[t] = new Set());
  sections.forEach(s => sSched[s] = new Set());
  let penalty = 0;
  for (const key in indiv) {
    const [teacher,, secs] = key.split("_");
    indiv[key].forEach(([d,s]) => {
      if (s === 4) penalty += 100; // lunch slot
      const timeKey = `${d}-${s}`;
      if (tSched[teacher].has(timeKey)) penalty += 5;
      else tSched[teacher].add(timeKey);
      secs.split(",").forEach(sec => {
        if (sSched[sec].has(timeKey)) penalty += 5;
        else sSched[sec].add(timeKey);
      });
    });
    // morning/afternoon balance
    const arr = indiv[key].map(([,s])=>s);
    const morn = arr.filter(x=>x<4).length;
    const aft = arr.filter(x=>x>4).length;
    if (morn===0||aft===0) penalty+=10;
  }
  return -penalty;
}

function crossover(a, b) {
  const child = {};
  const keys = Object.keys(a);
  keys.forEach((k,i) => {
    child[k] = i % 2 === 0 ? JSON.parse(JSON.stringify(a[k]))
                            : JSON.parse(JSON.stringify(b[k]));
  });
  return child;
}

function mutate(indiv, days, slotsPerDay, rate = 0.1) {
  const copy = JSON.parse(JSON.stringify(indiv));
  Object.keys(copy).forEach(k => {
    if (Math.random() < rate) {
      const half = Math.floor(copy[k].length/2);
      const newArr = [];
      for (let i=0;i<half;i++) newArr.push([Math.floor(Math.random()*days), Math.floor(Math.random()*4)]);
      for (let i=half;i<copy[k].length;i++) newArr.push([Math.floor(Math.random()*days), 5+Math.floor(Math.random()*(slotsPerDay[0]-5))]);
      copy[k] = newArr;
    }
  });
  return copy;
}

function runGA(instances, slotsPerDay, teachers, sections, gens=200, popSize=50) {
  const days = slotsPerDay.length;
  let pop = generatePopulation(instances, days, slotsPerDay, popSize);
  let best = null, bestScore = -Infinity;
  for (let g=0; g<gens; g++) {
    const scored = pop.map(ind => ({ind, score: fitness(ind, teachers, sections)}))
                    .sort((a,b)=>b.score-a.score);
    if (scored[0].score>bestScore) { bestScore=scored[0].score; best=scored[0].ind; }
    if (bestScore===0) break;
    const next=[best];
    while(next.length<popSize) {
      const half = popSize/2;
      const p1 = scored[Math.floor(Math.random()*half)].ind;
      const p2 = scored[Math.floor(Math.random()*half)].ind;
      next.push(mutate(crossover(p1,p2), days, slotsPerDay));
    }
    pop = next;
  }
  return best;
}

// Main generate function
async function generate(instances, givenSlots, teachers, sections) {
  const best = runGA(instances, givenSlots, teachers, sections);
  const days = givenSlots.length;
  const TT = Array(days).fill(0).map((_,d)=>Array(givenSlots[d]).fill(null));
  // room occupancy map per slot
  const roomOcc = Array(days).fill(0).map(()=>Array(givenSlots[0]).fill().map(()=>new Set()));
  // assign slots
  Object.entries(best).forEach(([key, slots]) => {
    const [teacher, subject, secs] = key.split("_");
    const secList = secs.split(",");
    slots.forEach(([d,s]) => {
      if (d<days && s<givenSlots[d]) {
        // pick random available room
        const available = ROOMS.filter(r=>!roomOcc[d][s].has(r));
        const room = available[Math.floor(Math.random()*available.length)];
        roomOcc[d][s].add(room);
        TT[d][s] = {teacher, subject, sections: secList, room};
      }
    });
  });
  // export CSV per section
  sections.forEach(sec => {
    const rows=[['Day','Period','Time','Teacher','Subject','Sections','Room']];
    TT.forEach((dayArr,d)=>{ dayArr.forEach((cell,p)=>{
      const time = TIME_SLOTS[p]||'';
      if (cell && cell.sections.includes(sec)) rows.push([
        d+1, p+1, time, cell.teacher, cell.subject, cell.sections.join(';'), cell.room
      ]);
    });});
    const csv=rows.map(r=>r.join(',')).join('\n');
    const fname = `timetable_${sec.replace(/\W+/g,'')}.csv`;
    fs.writeFileSync(path.join(__dirname,fname),csv);
  });
  console.log('CSVs generated.');
  return TT;
}

// Example usage
generate([
  {teacher:'T1',sections:['12A'],subject:'English',numLectures:12},
  {teacher:'T2',sections:['12A'],subject:'Hindi',numLectures:11},
  {teacher:'T3',sections:['12A'],subject:'Maths',numLectures:11},
  {teacher:'T1',sections:['12A'],subject:'Science',numLectures:11},
  {teacher:'T1',sections:['12B'],subject:'English',numLectures:11},
  {teacher:'T2',sections:['12B'],subject:'Hindi',numLectures:11},
  {teacher:'T3',sections:['12B'],subject:'Maths',numLectures:12},
  {teacher:'T1',sections:['12B'],subject:'Science',numLectures:11}
], [10,10,10,10,10], ['T1','T2','T3','T4','T5','T6'], ['12A','12B']);