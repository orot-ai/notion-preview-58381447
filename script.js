const { useState, useEffect, useCallback } = React;

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const CIRCUMFERENCE = 2 * Math.PI * 125;

function App() {
  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessions, setSessions] = useState(0);

  const totalTime = isWork ? WORK_TIME : BREAK_TIME;
  const progress = seconds / totalTime;
  const offset = CIRCUMFERENCE * (1 - progress);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  useEffect(() => {
    document.body.className = isWork ? 'work-mode' : 'break-mode';
  }, [isWork]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (isWork) {
            setSessions(s => s + 1);
            setIsWork(false);
            return BREAK_TIME;
          } else {
            setIsWork(true);
            return WORK_TIME;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, isWork]);

  const reset = () => {
    setIsRunning(false);
    setSeconds(isWork ? WORK_TIME : BREAK_TIME);
  };

  const skip = () => {
    setIsRunning(false);
    if (isWork) {
      setIsWork(false);
      setSeconds(BREAK_TIME);
    } else {
      setIsWork(true);
      setSeconds(WORK_TIME);
    }
  };

  return (
    <div className="timer-container">
      <div className="mode-label">{isWork ? '🔥 집중 시간' : '🌿 휴식 시간'}</div>
      <div className="circle-wrapper">
        <svg width="280" height="280" viewBox="0 0 280 280">
          <circle className="circle-bg" cx="140" cy="140" r="125" />
          <circle
            className={`circle-progress ${isWork ? 'work' : 'break'}`}
            cx="140" cy="140" r="125"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="time-display">{formatTime(seconds)}</div>
      </div>
      <div className="controls">
        <button className="btn" onClick={reset}>리셋</button>
        <button
          className={`btn primary ${!isWork ? 'break-btn' : ''}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '정지' : '시작'}
        </button>
        <button className="btn" onClick={skip}>스킵</button>
      </div>
      <div className="session-count">완료한 세션: {sessions}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);