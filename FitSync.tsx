import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, LineChart, Line
} from 'recharts';
import { 
  Dumbbell, History, Home, Plus, Trash2, 
  TrendingUp, Trophy, Target, 
  Activity, CheckCircle2, Play, X,
  Timer, RotateCcw, PlayCircle, PauseCircle,
  BarChart3, ChevronRight, PlusCircle, Scale, Repeat,
  Calendar, Zap, Flame, Award, Clock,
  Edit3, Save, ChevronDown, Star, Sparkles,
  TrendingDown, Users, Heart, Brain, Coffee,
  Milestone, BookOpen, Search, Filter, Copy,
  Settings, Sun, Moon, Volume2, VolumeX
} from 'lucide-react';

// --- Composants UI ---

const GlassCard = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-[2rem] p-5 shadow-2xl transition-all hover:border-indigo-500/30 active:scale-[0.97] group ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, color = "indigo", icon: Icon }) => {
  const colorClasses = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    slate: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  const selectedClass = colorClasses[color] || colorClasses.indigo;
  return (
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${selectedClass}`}>
      {Icon && <Icon size={10} />}
      {children}
    </span>
  );
};

const NavItem = ({ icon: Icon, label, onClick, active, badge }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 flex-1 relative py-1 transition-all duration-300`}
  >
    {badge && (
      <div className="absolute -top-0.5 right-1/4 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
    )}
    <div className={`p-2 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105' 
        : 'text-slate-500 active:bg-slate-800/50'
    }`}>
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[8px] font-black uppercase tracking-wider transition-all duration-300 ${active ? 'text-indigo-400 opacity-100' : 'text-slate-600 opacity-80'}`}>
      {label}
    </span>
  </button>
);

// Exercise Library Data
const EXERCISE_LIBRARY = {
  'Pectoraux': [
    { name: 'Développé Couché', defaultWeight: 60, defaultReps: 10 },
    { name: 'Développé Incliné', defaultWeight: 50, defaultReps: 10 },
    { name: 'Écarté Haltères', defaultWeight: 20, defaultReps: 12 },
    { name: 'Pompes', defaultWeight: 0, defaultReps: 15 },
    { name: 'Dips Pectoraux', defaultWeight: 0, defaultReps: 12 },
  ],
  'Dos': [
    { name: 'Tractions', defaultWeight: 0, defaultReps: 10 },
    { name: 'Rowing Barre', defaultWeight: 60, defaultReps: 10 },
    { name: 'Tirage Vertical', defaultWeight: 50, defaultReps: 12 },
    { name: 'Rowing Haltère', defaultWeight: 30, defaultReps: 10 },
    { name: 'Soulevé de Terre', defaultWeight: 100, defaultReps: 8 },
  ],
  'Jambes': [
    { name: 'Squat', defaultWeight: 80, defaultReps: 10 },
    { name: 'Leg Press', defaultWeight: 150, defaultReps: 12 },
    { name: 'Fentes', defaultWeight: 20, defaultReps: 12 },
    { name: 'Leg Curl', defaultWeight: 40, defaultReps: 12 },
    { name: 'Extension Jambes', defaultWeight: 50, defaultReps: 15 },
  ],
  'Épaules': [
    { name: 'Développé Militaire', defaultWeight: 40, defaultReps: 10 },
    { name: 'Élévations Latérales', defaultWeight: 12, defaultReps: 15 },
    { name: 'Oiseau Haltères', defaultWeight: 10, defaultReps: 15 },
    { name: 'Face Pull', defaultWeight: 30, defaultReps: 15 },
  ],
  'Bras': [
    { name: 'Curl Barre', defaultWeight: 30, defaultReps: 12 },
    { name: 'Extension Triceps', defaultWeight: 25, defaultReps: 12 },
    { name: 'Curl Haltères', defaultWeight: 15, defaultReps: 12 },
    { name: 'Dips Triceps', defaultWeight: 0, defaultReps: 12 },
  ],
};

// Achievements System
const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'Premier Pas', desc: 'Terminer 1 séance', icon: Sparkles, target: 1, color: 'emerald' },
  { id: 'week_streak', name: 'Régularité', desc: '7 jours consécutifs', icon: Flame, target: 7, color: 'amber' },
  { id: 'volume_king', name: 'Titan', desc: '10,000kg de volume total', icon: Trophy, target: 10000, color: 'indigo' },
  { id: 'pr_hunter', name: 'Chasseur de Records', desc: 'Battre 5 PRs', icon: Target, target: 5, color: 'rose' },
  { id: 'dedication', name: 'Dévouement', desc: '30 séances complétées', icon: Award, target: 30, color: 'purple' },
];

// --- Application Principale ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]); 
  const [bodyMetrics, setBodyMetrics] = useState([]);
  const [achievements, setAchievements] = useState([]);
  
  const [restTime, setRestTime] = useState(150); 
  const [isRestRunning, setIsRestRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const restRef = useRef(null);

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [newProgram, setNewProgram] = useState({ name: '', exercises: [], color: 'indigo' });
  const [tempExo, setTempExo] = useState({ name: '', weight: '', reps: '', sets: '3', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const [newMetric, setNewMetric] = useState({ weight: '', bodyFat: '' });
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);

  // Load data
  useEffect(() => {
    const savedLogs = localStorage.getItem('fitlog_elite_logs');
    const savedPrograms = localStorage.getItem('fitlog_elite_programs');
    const savedMetrics = localStorage.getItem('fitlog_elite_metrics');
    const savedAchievements = localStorage.getItem('fitlog_elite_achievements');
    const savedSound = localStorage.getItem('fitlog_elite_sound');
    
    if (savedLogs) setSessions(JSON.parse(savedLogs));
    if (savedPrograms) setPrograms(JSON.parse(savedPrograms));
    if (savedMetrics) setBodyMetrics(JSON.parse(savedMetrics));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedSound !== null) setSoundEnabled(JSON.parse(savedSound));
  }, []);

  const saveLogs = (data) => {
    setSessions(data);
    localStorage.setItem('fitlog_elite_logs', JSON.stringify(data));
    checkAchievements(data);
  };

  const savePrograms = (data) => {
    setPrograms(data);
    localStorage.setItem('fitlog_elite_programs', JSON.stringify(data));
  };

  const saveMetrics = (data) => {
    setBodyMetrics(data);
    localStorage.setItem('fitlog_elite_metrics', JSON.stringify(data));
  };

  const saveAchievements = (data) => {
    setAchievements(data);
    localStorage.setItem('fitlog_elite_achievements', JSON.stringify(data));
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('fitlog_elite_sound', JSON.stringify(newValue));
  };

  // Achievement checking
  const checkAchievements = (logs) => {
    const newUnlocked = [];
    const uniqueSessions = new Set(logs.map(s => `${s.dateStr}-${s.category}`)).size;
    const totalVolume = logs.reduce((acc, s) => acc + s.volume, 0);
    
    ACHIEVEMENTS.forEach(ach => {
      if (!achievements.includes(ach.id)) {
        let unlocked = false;
        if (ach.id === 'first_workout' && uniqueSessions >= 1) unlocked = true;
        if (ach.id === 'dedication' && uniqueSessions >= 30) unlocked = true;
        if (ach.id === 'volume_king' && totalVolume >= 10000) unlocked = true;
        
        if (unlocked) newUnlocked.push(ach.id);
      }
    });
    
    if (newUnlocked.length > 0) {
      saveAchievements([...achievements, ...newUnlocked]);
      if (soundEnabled) playSound();
    }
  };

  const playSound = () => {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Rest timer
  useEffect(() => {
    if (isRestRunning && restTime > 0) {
      restRef.current = setInterval(() => setRestTime(prev => prev - 1), 1000);
    } else {
      clearInterval(restRef.current);
      if (restTime === 0 && soundEnabled) {
        playSound();
        setIsRestRunning(false);
      }
    }
    return () => clearInterval(restRef.current);
  }, [isRestRunning, restTime, soundEnabled]);

  const formatTime = (seconds) => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = (program) => {
    const exercisesWithProgress = program.exercises.map(ex => ({ ...ex, setsDone: 0 }));
    setActiveWorkout({ ...program, exercises: exercisesWithProgress, startTime: new Date(), completedIds: [] });
    setRestTime(150);
    setIsRestRunning(false);
    setActiveTab('active-workout');
  };

  const incrementSet = (exoId) => {
    const updatedExos = activeWorkout.exercises.map(ex => {
      if (ex.id === exoId) {
        const newSetsDone = Math.min(ex.setsDone + 1, Number(ex.sets));
        if (newSetsDone > ex.setsDone && soundEnabled) {
          playSound();
        }
        return { ...ex, setsDone: newSetsDone };
      }
      return ex;
    });
    const completedIds = updatedExos.filter(ex => ex.setsDone === Number(ex.sets)).map(ex => ex.id);
    setActiveWorkout({ ...activeWorkout, exercises: updatedExos, completedIds });
  };

  const updateExerciseInWorkout = (exoId, field, value) => {
    const updatedExos = activeWorkout.exercises.map(ex => 
      ex.id === exoId ? { ...ex, [field]: value } : ex
    );
    setActiveWorkout({ ...activeWorkout, exercises: updatedExos });
  };

  const finishWorkout = () => {
    const logEntries = activeWorkout.exercises
      .filter(ex => ex.setsDone > 0)
      .map(ex => ({
        id: Date.now() + Math.random(),
        exercise: ex.name,
        dateStr: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        category: activeWorkout.name,
        weight: Number(ex.weight),
        reps: Number(ex.reps),
        sets: ex.setsDone,
        volume: Number(ex.weight) * Number(ex.reps) * ex.setsDone,
        notes: ex.notes || ''
      }));
    if (logEntries.length > 0) saveLogs([...logEntries, ...sessions]);
    setActiveWorkout(null);
    setActiveTab('home');
  };

  const addMetric = () => {
    if (!newMetric.weight) return;
    const metric = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      weight: Number(newMetric.weight),
      bodyFat: newMetric.bodyFat ? Number(newMetric.bodyFat) : null
    };
    saveMetrics([metric, ...bodyMetrics]);
    setNewMetric({ weight: '', bodyFat: '' });
    setShowMetricsModal(false);
  };

  const duplicateProgram = (program) => {
    const duplicate = {
      ...program,
      id: Date.now(),
      name: `${program.name} (Copie)`,
      exercises: program.exercises.map(ex => ({ ...ex, id: Date.now() + Math.random() }))
    };
    savePrograms([...programs, duplicate]);
  };

  const analytics = useMemo(() => {
    const volumeMap = sessions.reduce((acc, s) => {
      acc[s.dateStr] = (acc[s.dateStr] || 0) + (s.volume);
      return acc;
    }, {});
    const volumeChart = Object.keys(volumeMap).map(date => ({ name: date, volume: volumeMap[date] })).reverse().slice(-14);
    
    const prsMap = sessions.reduce((acc, s) => {
      if (!acc[s.exercise] || s.weight > acc[s.exercise].weight) {
        acc[s.exercise] = { weight: s.weight, reps: s.reps, date: s.dateStr };
      }
      return acc;
    }, {});
    const prList = Object.keys(prsMap).map(name => ({ name, ...prsMap[name] })).sort((a, b) => b.weight - a.weight).slice(0, 5);
    
    const totalVolume = sessions.reduce((acc, s) => acc + s.volume, 0);
    const uniqueSessionsCount = new Set(sessions.map(s => `${s.dateStr}-${s.category}`)).size;
    
    const last7Days = sessions.filter(s => {
      const sessionDate = new Date(s.dateStr);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });
    const weekVolume = last7Days.reduce((acc, s) => acc + s.volume, 0);

    const exerciseFreq = sessions.reduce((acc, s) => {
      acc[s.exercise] = (acc[s.exercise] || 0) + 1;
      return acc;
    }, {});
    const topExercises = Object.entries(exerciseFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    return { volumeChart, prList, totalVolume, completedWorkouts: uniqueSessionsCount, weekVolume, topExercises };
  }, [sessions]);

  const filteredExercises = useMemo(() => {
    let exercises = [];
    if (selectedCategory === 'Tous') {
      Object.values(EXERCISE_LIBRARY).forEach(cat => exercises.push(...cat));
    } else {
      exercises = EXERCISE_LIBRARY[selectedCategory] || [];
    }
    
    if (searchQuery) {
      exercises = exercises.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return exercises;
  }, [selectedCategory, searchQuery]);

  const unlockedAchievements = ACHIEVEMENTS.filter(ach => achievements.includes(ach.id));
  const lockedAchievements = ACHIEVEMENTS.filter(ach => !achievements.includes(ach.id));

  return (
    <div className="min-h-screen bg-[#050810] text-slate-50 pb-28 overflow-x-hidden selection:bg-indigo-500/30" style={{ fontFamily: '"Outfit", sans-serif' }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;600;700;800;900&display=swap');
          body { font-family: 'Outfit', sans-serif; }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-emerald-600/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[50%] left-[50%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-10 pb-6 flex justify-between items-center max-w-lg mx-auto">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
             <h2 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Pro Edition</h2>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
            FITLOG <span className="text-indigo-500">ELITE</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleSound} className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-active:opacity-40 transition-opacity"></div>
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center active:scale-95 transition-transform">
              {soundEnabled ? <Volume2 className="text-indigo-500" size={18} /> : <VolumeX className="text-slate-600" size={18} />}
            </div>
          </button>
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Zap className="text-indigo-500 animate-float" size={20} fill="currentColor" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-5 space-y-6">

        {/* --- ACCUEIL --- */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Enhanced Stats Grid */}
            <section className="grid grid-cols-2 gap-3">
              <GlassCard className="bg-gradient-to-br from-indigo-600 to-indigo-700 border-none relative overflow-hidden h-36 flex flex-col justify-between p-5">
                <div className="absolute -right-3 -bottom-3 opacity-10 text-white"><TrendingUp size={80} strokeWidth={1.5} /></div>
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className="text-indigo-200" />
                  <p className="text-[9px] font-black uppercase text-indigo-100 tracking-wider">Volume Total</p>
                </div>
                <div>
                  <p className="text-3xl font-black italic tracking-tighter text-white">
                    {(analytics?.totalVolume / 1000).toFixed(1)}<span className="text-xs ml-1 uppercase opacity-90">T</span>
                  </p>
                  <p className="text-[8px] uppercase font-bold text-indigo-200 mt-1">
                    +{(analytics?.weekVolume / 1000).toFixed(1)}T cette semaine
                  </p>
                </div>
              </GlassCard>

              <div className="grid grid-rows-2 gap-3">
                <GlassCard className="flex items-center gap-3 py-3 px-4 h-full bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                  <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400"><Flame size={18} fill="currentColor" /></div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-emerald-400/60 tracking-wider">Séances</p>
                    <p className="text-xl font-black italic text-emerald-400 leading-none">{analytics?.completedWorkouts || 0}</p>
                  </div>
                </GlassCard>
                <GlassCard className="flex items-center justify-between py-3 px-4 h-full group hover:bg-slate-800/50 cursor-pointer" onClick={() => setActiveTab('programs')}>
                  <div>
                    <p className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Programmes</p>
                    <p className="text-xl font-black italic text-white leading-none">{programs.length}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
                </GlassCard>
              </div>
            </section>

            {/* Achievement Preview */}
            {unlockedAchievements.length > 0 && (
              <GlassCard className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20" onClick={() => setActiveTab('stats')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/20 rounded-xl">
                      <Trophy className="text-purple-400" size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-purple-400/60 tracking-wider">Succès débloqués</p>
                      <p className="text-xl font-black italic text-purple-400 leading-none">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-purple-500/50" />
                </div>
              </GlassCard>
            )}

            {/* Chart Area */}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><BarChart3 size={16} /></div>
                   <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Progression</p>
                </div>
                <Badge color="amber" icon={Calendar}>14J</Badge>
              </div>
              <div className="h-44 w-full">
                {analytics?.volumeChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.volumeChart}>
                      <defs>
                        <linearGradient id="gradMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} fill="url(#gradMobile)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 border border-dashed border-slate-800 rounded-2xl">
                    <Activity size={24} className="opacity-20 mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest italic">Commencez à vous entraîner</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Top Exercises */}
            {analytics?.topExercises.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                  <Star size={14} className="text-indigo-500" /> Exercices Favoris
                </h3>
                <div className="grid gap-2">
                  {analytics.topExercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/20 border border-slate-700/20 rounded-xl">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                        i === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        i === 1 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' :
                        'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        #{i+1}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-100 uppercase">{ex.name}</p>
                      </div>
                      <Badge color="slate">{ex.count}x</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PR Section */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                <Trophy size={14} className="text-amber-500" /> Records Personnels
              </h3>
              <div className="grid gap-2">
                {analytics?.prList.length > 0 ? analytics?.prList.map((pr, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-800/30 to-slate-800/10 border border-slate-700/20 rounded-2xl group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${
                         i === 0 ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20' :
                         i === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-lg shadow-slate-400/20' :
                         i === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' :
                         'bg-slate-900 border border-slate-800 text-slate-600'
                       }`}>
                         #{i+1}
                       </div>
                       <div>
                         <span className="text-xs font-black text-slate-100 uppercase italic leading-none">{pr.name}</span>
                         <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">{pr.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-lg font-black text-indigo-400 italic tabular-nums">{pr.weight}<span className="text-[9px] uppercase ml-0.5">kg</span></span>
                       <p className="text-[8px] font-bold text-slate-600 uppercase">{pr.reps} reps</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-700 text-[8px] font-black uppercase tracking-widest italic border border-dashed border-slate-900 rounded-2xl">
                    Aucun record établi
                  </div>
                )}
              </div>
            </div>

            {/* Body Metrics CTA */}
            <GlassCard className="p-5 bg-gradient-to-br from-rose-500/10 to-pink-500/5 border-rose-500/20" onClick={() => setShowMetricsModal(true)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500/20 rounded-xl">
                    <Scale className="text-rose-400" size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-rose-400/60 tracking-wider">Suivi Corporel</p>
                    <p className="text-sm font-black text-rose-400 leading-none mt-1">
                      {bodyMetrics.length > 0 ? `${bodyMetrics[0].weight} kg` : 'Ajouter une mesure'}
                    </p>
                  </div>
                </div>
                <Plus size={20} className="text-rose-400" strokeWidth={3} />
              </div>
            </GlassCard>
          </div>
        )}

        {/* --- PROGRAMMES --- */}
        {activeTab === 'programs' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-2xl italic uppercase tracking-tighter">Programmes</h3>
              <button onClick={() => setShowProgramModal(true)} className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-xl active:scale-90 shadow-lg shadow-indigo-600/30 transition-all">
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
            <div className="space-y-3">
              {programs.map(p => {
                const colorClasses = {
                  indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
                  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
                  rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
                  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
                  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
                };
                return (
                  <GlassCard key={p.id} className={`p-5 bg-gradient-to-br ${colorClasses[p.color] || colorClasses.indigo}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-black italic text-white uppercase tracking-tight leading-none mb-2">{p.name}</h4>
                        <div className="flex gap-1.5 flex-wrap">
                          <Badge color={p.color}>{p.exercises.length} EXOS</Badge>
                          <Badge color="slate">
                            {p.exercises.reduce((acc, ex) => acc + Number(ex.sets), 0)} SÉRIES
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <button 
                        onClick={() => duplicateProgram(p)} 
                        className="flex-1 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Copy size={12} /> Dupliquer
                      </button>
                      <button 
                        onClick={() => savePrograms(programs.filter(x => x.id !== p.id))} 
                        className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-all active:scale-95"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => startWorkout(p)} 
                        className={`p-3 bg-gradient-to-r from-${p.color}-500 to-${p.color}-600 text-white rounded-xl shadow-lg shadow-${p.color}-500/20 active:scale-95 transition-all`}
                        style={{
                          background: p.color === 'indigo' ? 'linear-gradient(to right, rgb(99 102 241), rgb(79 70 229))' :
                                     p.color === 'emerald' ? 'linear-gradient(to right, rgb(16 185 129), rgb(5 150 105))' :
                                     p.color === 'rose' ? 'linear-gradient(to right, rgb(244 63 94), rgb(225 29 72))' :
                                     p.color === 'amber' ? 'linear-gradient(to right, rgb(245 158 11), rgb(217 119 6))' :
                                     'linear-gradient(to right, rgb(168 85 247), rgb(147 51 234))'
                        }}
                      >
                        <Play size={18} fill="currentColor" />
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
              {programs.length === 0 && (
                <div className="py-24 text-center border border-dashed border-slate-900 rounded-[2rem]">
                  <Dumbbell className="mx-auto mb-4 text-slate-800 opacity-50" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 italic">
                    Créez votre premier programme
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SÉANCE ACTIVE --- */}
        {activeTab === 'active-workout' && activeWorkout && (
          <div className="space-y-4 animate-in fade-in duration-300 pb-10">
            <div className="flex items-center gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl">
               <button onClick={() => setActiveTab('programs')} className="p-2 bg-slate-800 rounded-lg text-slate-500 active:scale-95 transition-transform"><X size={18}/></button>
               <div className="flex-1">
                 <h2 className="text-lg font-black italic uppercase tracking-tighter truncate">{activeWorkout.name}</h2>
                 <p className="text-[8px] font-bold text-slate-600 uppercase">
                   {activeWorkout.exercises.filter(ex => ex.setsDone === Number(ex.sets)).length}/{activeWorkout.exercises.length} exercices
                 </p>
               </div>
               <Badge color="emerald" icon={Clock}>
                 {Math.floor((new Date() - activeWorkout.startTime) / 60000)}min
               </Badge>
            </div>

            <GlassCard className="bg-gradient-to-br from-indigo-600 to-indigo-700 border-none p-5 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-70 mb-2 flex items-center gap-1.5">
                          <Timer size={10} /> Temps de repos
                        </p>
                        <div className={`text-5xl font-black italic tracking-tighter tabular-nums leading-none transition-all ${restTime < 10 && isRestRunning ? 'text-rose-300 animate-pulse' : ''}`}>
                          {formatTime(restTime)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => { setRestTime(150); setIsRestRunning(false); }} 
                          className="bg-white/10 backdrop-blur-sm p-3 rounded-xl active:scale-90 transition-all hover:bg-white/20"
                        >
                          <RotateCcw size={18} />
                        </button>
                        <button 
                          onClick={() => setIsRestRunning(!isRestRunning)} 
                          className="bg-white text-indigo-600 px-4 py-3 rounded-xl font-black uppercase text-[10px] shadow-lg active:scale-90 transition-all flex items-center gap-1.5"
                        >
                          {isRestRunning ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                          {isRestRunning ? 'Pause' : 'Start'}
                        </button>
                    </div>
                </div>
            </GlassCard>

            <div className="space-y-2">
              {activeWorkout.exercises.map(ex => {
                const isCompleted = activeWorkout.completedIds.includes(ex.id);
                const isEditing = editingExercise === ex.id;
                
                return (
                  <div 
                    key={ex.id} 
                    className={`relative overflow-hidden rounded-2xl border transition-all ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border-emerald-500/30' 
                        : 'bg-slate-800/40 border-slate-800 backdrop-blur-sm'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => incrementSet(ex.id)}
                          disabled={isCompleted}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center border font-black text-xs transition-all active:scale-95 ${
                            isCompleted 
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                              : 'border-slate-700 text-slate-400 bg-slate-900/50 hover:border-indigo-500 hover:text-indigo-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={24} /> : `${ex.setsDone}/${ex.sets}`}
                        </button>
                        <div className="flex-1">
                          <p className={`font-black uppercase italic leading-none text-sm mb-1 ${
                            isCompleted ? 'text-slate-600 line-through' : 'text-white'
                          }`}>
                            {ex.name}
                          </p>
                          {!isEditing ? (
                            <div className="flex items-center gap-2">
                              <p className="text-[9px] font-bold text-slate-500 uppercase">
                                {ex.weight}kg • {ex.reps} reps
                              </p>
                              {!isCompleted && (
                                <button
                                  onClick={() => setEditingExercise(ex.id)}
                                  className="p-1 text-slate-600 hover:text-indigo-400 transition-colors"
                                >
                                  <Edit3 size={12} />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="number"
                                value={ex.weight}
                                onChange={(e) => updateExerciseInWorkout(ex.id, 'weight', e.target.value)}
                                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white"
                                placeholder="kg"
                              />
                              <input
                                type="number"
                                value={ex.reps}
                                onChange={(e) => updateExerciseInWorkout(ex.id, 'reps', e.target.value)}
                                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white"
                                placeholder="reps"
                              />
                              <button
                                onClick={() => setEditingExercise(null)}
                                className="p-1 text-emerald-400"
                              >
                                <Save size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {ex.notes && (
                        <div className="mt-2 p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                          <p className="text-[8px] text-slate-500 italic">{ex.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full" 
                      style={{ width: `${(ex.setsDone / Number(ex.sets)) * 100}%` }} 
                    />
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={finishWorkout} 
              className="w-full py-5 rounded-2xl font-black italic uppercase tracking-widest bg-gradient-to-r from-white to-slate-100 text-indigo-600 text-sm shadow-2xl mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> Terminer la séance
            </button>
          </div>
        )}

        {/* --- HISTORIQUE --- */}
        {activeTab === 'history' && (
            <div className="space-y-4 pb-10 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-2 px-1">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Journal</h2>
                  <Calendar className="text-slate-800" size={24} />
               </div>

               <div className="space-y-2">
                 {sessions.length > 0 ? sessions.map(s => (
                  <div key={s.id} className="flex justify-between items-center p-4 bg-slate-800/20 border border-slate-700/20 rounded-xl hover:border-indigo-500/30 transition-all group">
                    <div className="flex gap-3 items-center flex-1">
                        <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="font-black text-xs italic uppercase tracking-tight text-slate-100 leading-none">{s.exercise}</p>
                            <p className="text-[8px] text-slate-600 font-bold uppercase mt-1.5 flex items-center gap-2">
                              <span>{s.dateStr}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                              <span>{s.category}</span>
                            </p>
                            {s.notes && (
                              <p className="text-[8px] text-slate-500 italic mt-1 truncate">{s.notes}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-base text-indigo-400 italic leading-none tabular-nums">{s.weight}<span className="text-[8px] ml-0.5">kg</span></p>
                        <p className="text-[8px] text-slate-600 font-black uppercase mt-1">{s.sets}×{s.reps}</p>
                        <p className="text-[7px] text-slate-700 font-bold uppercase mt-0.5">{s.volume.toLocaleString()} kg total</p>
                    </div>
                  </div>
                 )) : (
                   <div className="py-24 text-center border border-dashed border-slate-900 rounded-2xl">
                     <History className="mx-auto mb-4 text-slate-800 opacity-50" size={40} />
                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-700 italic">
                       Votre historique apparaîtra ici
                     </p>
                   </div>
                 )}
               </div>
            </div>
        )}

        {/* --- STATISTIQUES & SUCCÈS --- */}
        {activeTab === 'stats' && (
          <div className="space-y-6 pb-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Statistiques</h2>
            
            {/* Body Metrics Chart */}
            {bodyMetrics.length > 0 && (
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><Scale size={16} /></div>
                    <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Évolution Corporelle</p>
                  </div>
                  <button onClick={() => setShowMetricsModal(true)} className="text-rose-400">
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...bodyMetrics].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <Line type="monotone" dataKey="weight" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between text-center">
                  <div>
                    <p className="text-[8px] font-black uppercase text-slate-600">Actuel</p>
                    <p className="text-lg font-black text-rose-400 italic">{bodyMetrics[0].weight} kg</p>
                  </div>
                  {bodyMetrics.length > 1 && (
                    <div>
                      <p className="text-[8px] font-black uppercase text-slate-600">Évolution</p>
                      <p className={`text-lg font-black italic ${
                        bodyMetrics[0].weight < bodyMetrics[bodyMetrics.length - 1].weight 
                          ? 'text-emerald-400' 
                          : 'text-amber-400'
                      }`}>
                        {(bodyMetrics[0].weight - bodyMetrics[bodyMetrics.length - 1].weight).toFixed(1)} kg
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* Achievements */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                <Award size={14} className="text-purple-500" /> Succès Débloqués
              </h3>
              <div className="grid gap-3">
                {unlockedAchievements.map(ach => {
                  const Icon = ach.icon;
                  return (
                    <GlassCard key={ach.id} className={`p-4 bg-gradient-to-r from-${ach.color}-500/20 to-${ach.color}-600/10 border-${ach.color}-500/30`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-3 bg-${ach.color}-500/20 rounded-xl`}>
                          <Icon className={`text-${ach.color}-400`} size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-sm text-white uppercase italic leading-none">{ach.name}</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">{ach.desc}</p>
                        </div>
                        <CheckCircle2 className={`text-${ach.color}-400`} size={20} />
                      </div>
                    </GlassCard>
                  );
                })}
              </div>

              {lockedAchievements.length > 0 && (
                <>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1 mt-6">
                    <Target size={14} className="text-slate-600" /> À Débloquer
                  </h3>
                  <div className="grid gap-3">
                    {lockedAchievements.map(ach => {
                      const Icon = ach.icon;
                      return (
                        <div key={ach.id} className="p-4 bg-slate-800/20 border border-slate-800/50 rounded-xl opacity-50">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                              <Icon className="text-slate-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-sm text-slate-500 uppercase italic leading-none">{ach.name}</p>
                              <p className="text-[8px] font-bold text-slate-700 uppercase mt-1">{ach.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- NAVBAR --- */}
      {activeTab !== 'active-workout' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50">
            <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/5 p-1.5 rounded-[1.5rem] flex justify-between items-center shadow-2xl shadow-black/50">
                <NavItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <NavItem icon={Dumbbell} label="Workouts" active={activeTab === 'programs'} onClick={() => setActiveTab('programs')} />
                <NavItem icon={History} label="Logs" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                <NavItem 
                  icon={Trophy} 
                  label="Stats" 
                  active={activeTab === 'stats'} 
                  onClick={() => setActiveTab('stats')}
                  badge={unlockedAchievements.length > 0}
                />
            </div>
        </div>
      )}

      {/* --- MODAL CRÉATION PROGRAMME --- */}
      {showProgramModal && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowProgramModal(false)}></div>
          <div className="w-full relative z-10 bg-slate-950 rounded-t-[2.5rem] border-t border-slate-800/50 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-500 ease-out max-h-[92vh] flex flex-col">
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mt-4 mb-2"></div>
            <div className="p-6 pb-4 flex justify-between items-center">
              <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">Nouveau Programme</h2>
              <button onClick={() => setShowProgramModal(false)} className="p-2.5 bg-slate-900 text-slate-500 rounded-full active:scale-90">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] ml-1">Titre</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl font-bold text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/50 transition-colors" 
                  placeholder="ex: PUSH DAY, JAMBES..." 
                  value={newProgram.name} 
                  onChange={e => setNewProgram({...newProgram, name: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] ml-1">Couleur</label>
                <div className="flex gap-2">
                  {['indigo', 'emerald', 'rose', 'amber', 'purple'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewProgram({...newProgram, color})}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${
                        newProgram.color === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{
                        background: color === 'indigo' ? '#6366f1' :
                                   color === 'emerald' ? '#10b981' :
                                   color === 'rose' ? '#f43f5e' :
                                   color === 'amber' ? '#f59e0b' :
                                   '#a855f7'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-indigo-500/5 p-5 rounded-3xl border border-indigo-500/10 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase text-indigo-400/60 tracking-[0.2em]">Ajouter Exercice</label>
                  <button
                    onClick={() => setShowExerciseLibrary(true)}
                    className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg text-[8px] font-black uppercase flex items-center gap-1"
                  >
                    <BookOpen size={10} /> Bibliothèque
                  </button>
                </div>
                
                <input 
                  className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-500/30" 
                  placeholder="Nom de l'exercice" 
                  value={tempExo.name} 
                  onChange={e => setTempExo({...tempExo, name: e.target.value})} 
                />
                
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5 text-center">
                        <span className="text-[8px] font-black text-slate-600 uppercase">Poids</span>
                        <input 
                          type="number" 
                          className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-center font-black text-indigo-400 text-xs outline-none" 
                          placeholder="KG" 
                          value={tempExo.weight} 
                          onChange={e => setTempExo({...tempExo, weight: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-1.5 text-center">
                        <span className="text-[8px] font-black text-slate-600 uppercase">Reps</span>
                        <input 
                          type="number" 
                          className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-center font-black text-indigo-400 text-xs outline-none" 
                          placeholder="REPS" 
                          value={tempExo.reps} 
                          onChange={e => setTempExo({...tempExo, reps: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-1.5 text-center">
                        <span className="text-[8px] font-black text-slate-600 uppercase">Séries</span>
                        <input 
                          type="number" 
                          className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-center font-black text-indigo-400 text-xs outline-none" 
                          placeholder="SETS" 
                          value={tempExo.sets} 
                          onChange={e => setTempExo({...tempExo, sets: e.target.value})} 
                        />
                    </div>
                </div>

                <textarea
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-400 outline-none resize-none"
                  placeholder="Notes (optionnel)"
                  rows="2"
                  value={tempExo.notes}
                  onChange={e => setTempExo({...tempExo, notes: e.target.value})}
                />
                
                <button 
                  onClick={() => { 
                    if(!tempExo.name) return; 
                    setNewProgram({...newProgram, exercises: [...newProgram.exercises, {...tempExo, id: Date.now()}]}); 
                    setTempExo({name:'', weight:'', reps:'', sets:'3', notes:''}); 
                  }} 
                  className="w-full py-3.5 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Ajouter
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] ml-1">
                  Exercices ({newProgram.exercises.length})
                </label>
                <div className="grid gap-2.5">
                  {newProgram.exercises.length > 0 ? newProgram.exercises.map(ex => (
                    <div key={ex.id} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex flex-col flex-1">
                        <span className="font-black italic uppercase text-xs text-white leading-none">{ex.name}</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                          {ex.sets} séries • {ex.weight}kg • {ex.reps} reps
                        </span>
                        {ex.notes && (
                          <span className="text-[8px] text-slate-600 italic mt-1">{ex.notes}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => setNewProgram({...newProgram, exercises: newProgram.exercises.filter(e => e.id !== ex.id)})} 
                        className="p-2 text-rose-500/40 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  )) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-900 rounded-3xl">
                      <p className="text-[9px] font-black uppercase text-slate-800 italic tracking-[0.3em]">Aucun exercice</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pointer-events-none">
               <button 
                 onClick={() => { 
                   if(!newProgram.name || newProgram.exercises.length === 0) return; 
                   savePrograms([...programs, {...newProgram, id: Date.now()}]); 
                   setShowProgramModal(false); 
                   setNewProgram({name:'', exercises:[], color: 'indigo'}); 
                 }} 
                 disabled={!newProgram.name || newProgram.exercises.length === 0} 
                 className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-2xl transition-all pointer-events-auto active:scale-95 ${
                   (!newProgram.name || newProgram.exercises.length === 0) 
                     ? 'bg-slate-900 text-slate-700' 
                     : 'bg-gradient-to-r from-white to-slate-100 text-indigo-600'
                 }`}
               >
                 Créer le programme
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL BIBLIOTHÈQUE D'EXERCICES --- */}
      {showExerciseLibrary && (
        <div className="fixed inset-0 z-[70] flex items-end">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowExerciseLibrary(false)}></div>
          <div className="w-full relative z-10 bg-slate-950 rounded-t-[2.5rem] border-t border-slate-800/50 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mt-4 mb-2"></div>
            <div className="p-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-black italic uppercase text-white tracking-tighter">Bibliothèque</h2>
                <button onClick={() => setShowExerciseLibrary(false)} className="p-2 bg-slate-900 text-slate-500 rounded-full">
                  <X size={18} />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Rechercher un exercice..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-sm text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/50 mb-3"
              />
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('Tous')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap ${
                    selectedCategory === 'Tous' 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  Tous
                </button>
                {Object.keys(EXERCISE_LIBRARY).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
              {filteredExercises.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTempExo({
                      name: ex.name,
                      weight: ex.defaultWeight.toString(),
                      reps: ex.defaultReps.toString(),
                      sets: '3',
                      notes: ''
                    });
                    setShowExerciseLibrary(false);
                  }}
                  className="w-full flex justify-between items-center p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all active:scale-98"
                >
                  <div className="text-left">
                    <p className="font-black text-sm text-white uppercase italic">{ex.name}</p>
                    <p className="text-[8px] text-slate-600 uppercase mt-1">
                      {ex.defaultWeight}kg • {ex.defaultReps} reps
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL MÉTRIQUES CORPORELLES --- */}
      {showMetricsModal && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowMetricsModal(false)}></div>
          <div className="w-full relative z-10 bg-slate-950 rounded-t-[2.5rem] border-t border-slate-800/50 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mt-4 mb-2"></div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">Mesures</h2>
                <button onClick={() => setShowMetricsModal(false)} className="p-2 bg-slate-900 text-slate-500 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] ml-1">Poids (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMetric.weight}
                    onChange={e => setNewMetric({...newMetric, weight: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl font-bold text-white placeholder:text-slate-700 outline-none focus:border-rose-500/50"
                    placeholder="75.5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] ml-1">% Masse grasse (optionnel)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMetric.bodyFat}
                    onChange={e => setNewMetric({...newMetric, bodyFat: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl font-bold text-white placeholder:text-slate-700 outline-none focus:border-rose-500/50"
                    placeholder="15.0"
                  />
                </div>
              </div>

              <button
                onClick={addMetric}
                disabled={!newMetric.weight}
                className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-2xl transition-all active:scale-95 ${
                  !newMetric.weight
                    ? 'bg-slate-900 text-slate-700'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                }`}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
