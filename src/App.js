import logo from './logo.svg';
import './App.css';
import { text } from './text.js'
import { useCallback, useEffect, useMemo, useState } from 'react';

// 行列転換
const transpose = (ary) => ary[0].map((_, i) => ary.map(row => row[i]));

// 文章の分割処理
const compose = (text) => {
  const lines = [];
  let buff = [];
  for (const ch of text) {
    buff.push(ch);
    if (buff.length < 20 && ch !== '\n') {
      continue;
    }
    if (buff.length < 20) {
      const fixer = Array(20).fill('').map((ch) => ch);
      buff = buff.concat(fixer).slice(0, 20);
    }
    lines.push(buff);
    buff = [];
  }
  if (buff.length < 20) {
    const fixer = Array(20).fill('').map((ch) => ch);
    buff = buff.concat(fixer).slice(0, 20);
  }
  lines.push(buff);
  // return lines.reverse();
  return lines;
}

const composed = compose(text);

console.log(composed)

const intervals = [200, 1000, 2000, 3000, 4000, 5000];

function App() {
  const [int, setInt] = useState(1000);
  const [isStarted, setIsStarted] = useState(false);

  const [take, setTake] = useState(3);
  const [time, setTime] = useState(0);
  const [offset, setOffset] = useState(0);
  const table = Array(12).fill('').map(() => Array(20).fill('').map((b) => b))

   // レンダリング関数メモ化
  const render = useMemo(() => {
    if (composed.slice(offset, offset + take).length <= 0) return <div>Fin.</div>;
    const target = composed.slice(offset, offset + take).reverse();

    const renderTarget = table.slice(0, 12 - (offset % 12))
      .concat(target)
      .concat(table.slice(12 - (offset % 12 + take)))
      // .slice(0, 12);
    const lines = transpose(renderTarget);

    return (
      <table>
        <tbody>
          {lines.map((line, idx) => (
            <tr key={idx}>
              {line.map((ch, index) =>( 
                <td key={`${ch}-${idx}-${index}`}>{ch}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }, [offset, take, table])
  
  // タイマーコールバック
  const onUpdate = useCallback(() => {
    setTime((old) => old + 1);
    setOffset((old) => old + take);
  }, [setTime, setOffset, take]);

  // タイマー処理
  useEffect(() => {
    const timerId = setInterval(() => {
      if (!isStarted) return;
      onUpdate()
    }, int);
    return () => clearInterval(timerId);
  }, [int, isStarted, onUpdate])

  const start = () => setIsStarted(true);
  const stop = () => setIsStarted(false);
  const changeInt = (interval) => setInt(interval)

  return (
    <div className="App">
      <p>{time}</p>
      <div>
        <p>Interval</p>
        <div className="radios-wrapper">
          <div className="radios">
            {intervals.map((interval) => (
              <div className="" key={interval}>
                <label>{interval}</label><input type='radio' checked={int === interval} onChange={() => changeInt(interval)} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <button type="button" onClick={start}>Start</button>
        <button type="button" onClick={stop}>Stop</button>
      </div>
      <div className="card wrapper">
        {render}
      </div>
    </div>
  );
}

export default App;
