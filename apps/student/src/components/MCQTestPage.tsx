import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Mic, ShieldCheck, Maximize, AlertTriangle, CheckCircle2 } from 'lucide-react';

const questions: Array<[string, string[], number]> = [
  ['What does an IR sensor detect in a line-following robot?', ['Surface reflectivity','Internet speed','Battery brand','GPS position'],0],
  ['Which language is commonly used with Arduino?', ['HTML','Embedded C/C++','SQL','Bash only'],1],
  ['What is the purpose of PWM?', ['Control average power/speed','Store images','Encrypt passwords','Measure distance only'],0],
  ['Which component drives DC motors?', ['H-bridge driver','Breadboard only','LED','Resistor alone'],0],
  ['What does PID stand for?', ['Proportional Integral Derivative','Power Input Data','Programmed Internet Device','Parallel Input Driver'],0],
  ['What is a database primary key?', ['A unique row identifier','A password hint','A chart type','A CSS class'],0],
  ['Which protocol is commonly used for web APIs?', ['HTTP','FTP only','SMTP only','I2C only'],0],
  ['What does SQL query?', ['Structured data','Motor voltage','Camera focus','CPU temperature only'],0],
  ['What is machine learning?', ['Learning patterns from data','Manual wiring','A battery type','A browser plugin'],0],
  ['What does a classifier predict?', ['A category or label','Only voltage','Only file size','A keyboard shortcut'],0],
  ['What is Docker used for?', ['Containerizing applications','Drawing circuits','Editing photos only','Measuring humidity'],0],
  ['What does cloud computing provide?', ['On-demand computing resources','Only local storage','A physical sensor','A keyboard'],0],
  ['What is a sensor calibration?', ['Adjusting readings against a reference','Deleting code','Increasing screen brightness','Changing a username'],0],
  ['What is version control useful for?', ['Tracking code changes','Charging batteries','Detecting IR light','Rendering video only'],0],
  ['Which structure repeats while a condition is true?', ['while loop','if statement only','class name','import'],0],
  ['What is an API?', ['An interface for software communication','A battery connector','A robot wheel','A chart legend'],0],
  ['What does cybersecurity protect?', ['Systems and data','Only monitors','Only cables','Only fonts'],0],
  ['What is a roadmap stage?', ['A planned learning milestone','A browser tab','A database password','A random color'],0],
  ['Why are tests used in software?', ['To detect defects','To increase file size','To remove documentation','To disable backups'],0],
  ['What is a project trade-off?', ['Choosing one benefit while accepting a cost','A login screen','A font style','A sensor cable'],0],
];

export const MCQTestPage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addWarning = (message: string) => setWarnings((w) => [...w, `${new Date().toLocaleTimeString()} — ${message}`].slice(-10));
  useEffect(() => {
    if (videoRef.current && stream) { videoRef.current.srcObject = stream; videoRef.current.play().catch(()=>{}); }
  }, [stream]);
  useEffect(() => {
    const visibility = () => document.visibilityState === 'hidden' && addWarning('Tab/window was hidden.');
    const blur = () => addWarning('Test window lost focus.');
    const fs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', blur); document.addEventListener('fullscreenchange', fs);
    const stop = () => stream?.getTracks().forEach(t=>t.stop());
    return () => { document.removeEventListener('visibilitychange', visibility); window.removeEventListener('blur', blur); document.removeEventListener('fullscreenchange', fs); stop(); };
  }, [stream]);
  const start = async () => {
    setError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true});
      setStream(s);
      try { await document.documentElement.requestFullscreen(); } catch { addWarning('Fullscreen permission was not granted.'); }
    } catch { setError('Camera/microphone permission was denied or no device was found. Check browser permissions and try again.'); }
  };
  const score = useMemo(() => questions.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0), [answers]);
  const q = questions[index];
  return <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8">
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-wrap justify-between gap-3"><div><p className="text-xs font-bold text-indigo-600">HIREZONE • ASSESSMENT</p><h1 className="text-2xl font-bold">Project Knowledge Test</h1><p className="text-sm text-slate-500">20 MCQs • low scores do not block your journey</p></div><div className="text-sm font-semibold">Question {index+1} / {questions.length}</div></header>
      <section className="grid md:grid-cols-[220px_1fr] gap-4">
        <aside className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3"><h2 className="font-bold">Test environment</h2><video ref={videoRef} autoPlay muted playsInline className="w-full aspect-video rounded-xl bg-slate-900 object-cover"/><div className="text-xs space-y-1"><p><Camera className="inline w-4 h-4 mr-1"/>Camera: {stream?.getVideoTracks().some(t=>t.readyState==='live')?'Ready':'Not started'}</p><p><Mic className="inline w-4 h-4 mr-1"/>Microphone: {stream?.getAudioTracks().some(t=>t.readyState==='live')?'Ready':'Not started'}</p><p><ShieldCheck className="inline w-4 h-4 mr-1"/>Fullscreen: {fullscreen?'Active':'Inactive'}</p></div><button onClick={start} className="w-full rounded-xl bg-indigo-600 text-white py-2 text-sm font-bold">Enable camera & mic</button><button onClick={()=>document.documentElement.requestFullscreen?.()} className="w-full rounded-xl border py-2 text-sm font-bold"><Maximize className="inline w-4 h-4 mr-1"/>Fullscreen</button>{error&&<p className="text-xs text-red-600">{error}</p>}</aside>
        <main className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 space-y-5"><div className="h-2 bg-slate-100 rounded-full"><div className="h-2 bg-indigo-600 rounded-full" style={{width:`${((index+1)/questions.length)*100}%`}}/></div><p className="text-lg font-bold">{q[0]}</p><div className="grid gap-3">{q[1].map((option,i)=><button key={i} disabled={submitted} onClick={()=>setAnswers({...answers,[index]:i})} className={`text-left rounded-xl border p-4 ${answers[index]===i?'border-indigo-500 bg-indigo-50':'border-slate-200 hover:bg-slate-50'}`}><b>{String.fromCharCode(65+i)}.</b> {option}</button>)}</div><div className="flex justify-between gap-3"><button disabled={index===0} onClick={()=>setIndex(index-1)} className="rounded-xl border px-4 py-2 disabled:opacity-40">Previous</button>{index<questions.length-1?<button onClick={()=>setIndex(index+1)} className="rounded-xl bg-indigo-600 text-white px-5 py-2">Next</button>:<button onClick={()=>setSubmitted(true)} className="rounded-xl bg-emerald-600 text-white px-5 py-2">Submit test</button>}</div>{submitted&&<div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5"><CheckCircle2 className="inline mr-2 text-emerald-700"/><b>Score: {score}/{questions.length}</b><p className="text-sm mt-2">Your result is recorded for learning. You may continue to the descriptive project question even with a low score.</p></div>}</main>
      </section>{warnings.length>0&&<div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm"><AlertTriangle className="inline mr-2"/>Integrity events: {warnings.length}<ul className="list-disc pl-5 text-xs mt-2">{warnings.map((w,i)=><li key={i}>{w}</li>)}</ul></div>}
    </div></div>;
};
