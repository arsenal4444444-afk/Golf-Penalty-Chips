(function(){
  const peopleEl = document.getElementById('people');
  const yenEl = document.getElementById('yen');
  const playersEl = document.getElementById('players');
  const resultEl = document.getElementById('result');
  const defaultNames = ['A','B','C','D','E','F'];

  function renderPlayers(){
    const n = Number(peopleEl.value);
    const oldNames = [...document.querySelectorAll('.name')].map(i=>i.value);
    const oldChips = [...document.querySelectorAll('.chip')].map(i=>i.value);

    playersEl.innerHTML = '';

    for(let i = 0; i < n; i++){
      const div = document.createElement('div');
      div.className = 'player';
      div.innerHTML = `
        <div>
          <label>プレイヤー</label>
          <input class="name" value="${oldNames[i] || defaultNames[i]}" maxlength="10">
        </div>
        <div>
          <label>チップ枚数</label>
          <input class="chip" inputmode="numeric" type="number" min="0" step="1" value="${oldChips[i] || 0}">
        </div>
      `;
      playersEl.appendChild(div);
    }
  }

  function calculate(){
    const point = Math.max(1, Number(yenEl.value || 0));

    const players = [...document.querySelectorAll('.player')].map((row, idx) => ({
      name: row.querySelector('.name').value.trim() || defaultNames[idx],
      chips: Math.max(0, Number(row.querySelector('.chip').value || 0))
    }));

    const payments = [];

    // 正式ルール：全員総当たり
    // チップが多い人が、少ない人へ「差額 × ポイント」を渡す
    for(let i = 0; i < players.length; i++){
      for(let j = i + 1; j < players.length; j++){
        const a = players[i];
        const b = players[j];

        if(a.chips === b.chips) continue;

        const payer = a.chips > b.chips ? a : b;
        const receiver = a.chips > b.chips ? b : a;
        const diff = Math.abs(a.chips - b.chips);

        payments.push({
          from: payer.name,
          to: receiver.name,
          diff: diff,
          amount: diff * point
        });
      }
    }

    resultEl.className = 'result show';

    if(payments.length === 0){
      resultEl.innerHTML = '<h2>精算結果</h2><div class="empty">全員同じ枚数です。精算なし！</div>';
      return;
    }

    const chipText = players.map(p => `${p.name}：${p.chips}枚`).join('　');

    resultEl.innerHTML = `
      <h2>精算結果</h2>
      <div class="summary">${chipText}<br>1チップ：${point.toLocaleString()}ポイント</div>
      ${payments.map(p => `
        <div class="pay">
          <div>${p.from} → ${p.to}<small>${p.diff}枚差</small></div>
          <div>${p.amount.toLocaleString()}ポイント</div>
        </div>
      `).join('')}
    `;
  }

  peopleEl.addEventListener('change', () => {
    renderPlayers();
    resultEl.className = 'result';
    resultEl.innerHTML = '';
  });

document.getElementById('calc').addEventListener('click', calculate);

document.getElementById('reset').addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(input => {
    input.value = 0;
  });

  yenEl.value = 500;
  renderPlayers();
  resultEl.className = 'result';
  resultEl.innerHTML = '';
});
  
  renderPlayers();
})();
