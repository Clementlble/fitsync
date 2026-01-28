import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Settings, Sun, Moon, Volume2, VolumeX, Check,
  ChevronLeft, CalendarDays, Edit, User as UserIcon,
  Pill, Bell, LogOut, Camera, Mail, Phone, MapPin
} from 'lucide-react';

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

const SimpleChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.volume));
  const width = 100;
  const height = 100;
  const padding = 10;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - padding - ((d.volume / maxValue) * (height - 2 * padding));
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-44 relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={padding}
            y1={padding + (i * (height - 2 * padding) / 4)}
            x2={width - padding}
            y2={padding + (i * (height - 2 * padding) / 4)}
            stroke="#1e293b"
            strokeWidth="0.2"
            strokeDasharray="1,1"
            opacity="0.3"
          />
        ))}
        
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <polygon
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
          fill="url(#chartGradient)"
        />
        
        <polyline
          points={points}
          fill="none"
          stroke="#6366f1"
          strokeWidth="1"
        />
        
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - padding - ((d.volume / maxValue) * (height - 2 * padding));
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1"
              fill="#6366f1"
            />
          );
        })}
      </svg>
    </div>
  );
};

const PieChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let currentAngle = -90;
  
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'];
  
  return (
    <div className="w-full h-44 relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-40 h-40">
        {data.map((item, i) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = 50 + 40 * Math.cos(startRad);
          const y1 = 50 + 40 * Math.sin(startRad);
          const x2 = 50 + 40 * Math.cos(endRad);
          const y2 = 50 + 40 * Math.sin(endRad);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');
          
          currentAngle += angle;
          
          return (
            <path
              key={i}
              d={pathData}
              fill={colors[i % colors.length]}
              opacity="0.8"
            />
          );
        })}
        <circle cx="50" cy="50" r="20" fill="#0f172a" />
      </svg>
    </div>
  );
};

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

const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'Premier Pas', desc: 'Terminer 1 séance', icon: Sparkles, target: 1, color: 'emerald' },
  { id: 'week_streak', name: 'Régularité', desc: '7 jours consécutifs', icon: Flame, target: 7, color: 'amber' },
  { id: 'volume_king', name: 'Titan', desc: '10,000kg de volume total', icon: Trophy, target: 10000, color: 'indigo' },
  { id: 'pr_hunter', name: 'Chasseur de Records', desc: 'Battre 5 PRs', icon: Target, target: 5, color: 'rose' },
  { id: 'dedication', name: 'Dévouement', desc: '30 séances complétées', icon: Award, target: 30, color: 'purple' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]); 
  const [bodyMetrics, setBodyMetrics] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [supplementLog, setSupplementLog] = useState([]);
  
  const [restTime, setRestTime] = useState(150); 
  const [isRestRunning, setIsRestRunning] = useState(false);

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [showAddSupplementModal, setShowAddSupplementModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  
  const [newProgram, setNewProgram] = useState({ name: '', exercises: [], color: 'indigo' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const [newMetric, setNewMetric] = useState({ weight: '', bodyFat: '' });
  const [activeWorkout, setActiveWorkout] = useState(null);

  const [newCustomExercise, setNewCustomExercise] = useState({
    name: '',
    category: 'Personnalisé',
    defaultWeight: 20,
    defaultReps: 10
  });

  const [newSupplement, setNewSupplement] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    color: 'indigo'
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Athlète Elite',
    email: 'athlete@fitlog.com',
    goal: 'Prise de masse',
    notifications: true
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const savedLogs = localStorage.getItem('fitlog_elite_logs');
    const savedPrograms = localStorage.getItem('fitlog_elite_programs');
    const savedMetrics = localStorage.getItem('fitlog_elite_metrics');
    const savedAchievements = localStorage.getItem('fitlog_elite_achievements');
    const savedCustomExercises = localStorage.getItem('fitlog_elite_custom_exercises');
    const savedSupplements = localStorage.getItem('fitlog_elite_supplements');
    const savedSupplementLog = localStorage.getItem('fitlog_elite_supplement_log');
    const savedUserProfile = localStorage.getItem('fitlog_elite_user_profile');
    
    if (savedLogs) setSessions(JSON.parse(savedLogs));
    if (savedPrograms) setPrograms(JSON.parse(savedPrograms));
    if (savedMetrics) setBodyMetrics(JSON.parse(savedMetrics));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedCustomExercises) setCustomExercises(JSON.parse(savedCustomExercises));
    if (savedSupplements) setSupplements(JSON.parse(savedSupplements));
    if (savedSupplementLog) setSupplementLog(JSON.parse(savedSupplementLog));
    if (savedUserProfile) setUserProfile(JSON.parse(savedUserProfile));
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

  const saveCustomExercises = (data) => {
    setCustomExercises(data);
    localStorage.setItem('fitlog_elite_custom_exercises', JSON.stringify(data));
  };

  const saveSupplements = (data) => {
    setSupplements(data);
    localStorage.setItem('fitlog_elite_supplements', JSON.stringify(data));
  };

  const saveSupplementLog = (data) => {
    setSupplementLog(data);
    localStorage.setItem('fitlog_elite_supplement_log', JSON.stringify(data));
  };

  const saveUserProfile = (data) => {
    setUserProfile(data);
    localStorage.setItem('fitlog_elite_user_profile', JSON.stringify(data));
  };

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
    }
  };

  useEffect(() => {
    let interval;
    if (isRestRunning && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsRestRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestRunning]);

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
        return { ...ex, setsDone: newSetsDone };
      }
      return ex;
    });
    const completedIds = updatedExos.filter(ex => ex.setsDone === Number(ex.sets)).map(ex => ex.id);
    setActiveWorkout({ ...activeWorkout, exercises: updatedExos, completedIds });
    
    setRestTime(150);
    setIsRestRunning(true);
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
        fullDate: new Date().toISOString(),
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

  const addExerciseToProgram = (exo) => {
    const newExo = {
      ...exo,
      id: Date.now(),
      weight: exo.defaultWeight || 20,
      reps: exo.defaultReps || 10,
      sets: '3'
    };
    setNewProgram(prev => ({ ...prev, exercises: [...prev.exercises, newExo] }));
    setShowExerciseLibrary(false);
  };

  const handleCreateProgram = () => {
    if (!newProgram.name || newProgram.exercises.length === 0) return;
    const finalProgram = { ...newProgram, id: Date.now() };
    savePrograms([...programs, finalProgram]);
    setNewProgram({ name: '', exercises: [], color: 'indigo' });
    setShowProgramModal(false);
  };

  const addMetric = () => {
    if (!newMetric.weight) return;
    const metric = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      fullDate: new Date().toISOString(),
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

  const deleteSession = (sessionKey) => {
    const updated = sessions.filter(s => `${s.dateStr}-${s.category}` !== sessionKey);
    saveLogs(updated);
  };

  const handleAddCustomExercise = () => {
    if (!newCustomExercise.name) return;
    const exercise = {
      ...newCustomExercise,
      id: Date.now()
    };
    saveCustomExercises([...customExercises, exercise]);
    setNewCustomExercise({ name: '', category: 'Personnalisé', defaultWeight: 20, defaultReps: 10 });
    setShowAddExerciseModal(false);
  };

  const handleEditCustomExercise = () => {
    if (!editingExercise || !editingExercise.name) return;
    const updated = customExercises.map(ex => 
      ex.id === editingExercise.id ? editingExercise : ex
    );
    saveCustomExercises(updated);
    setEditingExercise(null);
    setShowEditExerciseModal(false);
  };

  const openEditExercise = (exercise) => {
    setEditingExercise({ ...exercise });
    setShowEditExerciseModal(true);
  };

  const deleteCustomExercise = (id) => {
    saveCustomExercises(customExercises.filter(ex => ex.id !== id));
  };

  const handleAddSupplement = () => {
    if (!newSupplement.name) return;
    const supplement = {
      ...newSupplement,
      id: Date.now()
    };
    saveSupplements([...supplements, supplement]);
    setNewSupplement({ name: '', dosage: '', frequency: 'daily', color: 'indigo' });
    setShowAddSupplementModal(false);
  };

  const logSupplementIntake = (supplementId) => {
    const today = new Date().toDateString();
    const log = {
      id: Date.now(),
      supplementId,
      date: today,
      fullDate: new Date().toISOString()
    };
    saveSupplementLog([...supplementLog, log]);
  };

  const isSupplementTakenToday = (supplementId) => {
    const today = new Date().toDateString();
    return supplementLog.some(log => log.supplementId === supplementId && log.date === today);
  };

  const deleteSupplement = (id) => {
    saveSupplements(supplements.filter(s => s.id !== id));
    saveSupplementLog(supplementLog.filter(log => log.supplementId !== id));
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
      const sessionDate = new Date(s.fullDate || s.dateStr);
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
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const categoryVolume = sessions.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + s.volume;
      return acc;
    }, {});
    const categoryData = Object.entries(categoryVolume).map(([name, value]) => ({ name, value }));

    const weightChart = bodyMetrics.slice(0, 10).reverse().map(m => ({ 
      name: m.date, 
      weight: m.weight 
    }));

    return { 
      volumeChart, 
      prList, 
      totalVolume, 
      completedWorkouts: uniqueSessionsCount, 
      weekVolume, 
      topExercises,
      categoryData,
      weightChart
    };
  }, [sessions, bodyMetrics]);

  const allExercises = useMemo(() => {
    let exercises = [];
    Object.entries(EXERCISE_LIBRARY).forEach(([category, exos]) => {
      exercises.push(...exos.map(ex => ({ ...ex, category })));
    });
    exercises.push(...customExercises);
    return exercises;
  }, [customExercises]);

  const filteredExercises = useMemo(() => {
    let exercises = [];
    if (selectedCategory === 'Tous') {
      exercises = allExercises;
    } else if (selectedCategory === 'Personnalisé') {
      exercises = customExercises;
    } else {
      exercises = EXERCISE_LIBRARY[selectedCategory] || [];
    }
    
    if (searchQuery) {
      exercises = exercises.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return exercises;
  }, [selectedCategory, searchQuery, allExercises, customExercises]);

  const unlockedAchievements = ACHIEVEMENTS.filter(ach => achievements.includes(ach.id));

  const workoutDates = useMemo(() => {
    const dates = new Set();
    sessions.forEach(s => {
      if (s.fullDate) {
        const date = new Date(s.fullDate);
        dates.add(date.toDateString());
      }
    });
    return dates;
  }, [sessions]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hasWorkout = workoutDates.has(date.toDateString());
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div 
          key={day} 
          className={`aspect-square flex items-center justify-center rounded-xl text-xs font-black relative transition-all ${
            isToday ? 'bg-indigo-500 text-white' : 
            hasWorkout ? 'bg-emerald-500/20 text-emerald-400' : 
            'text-slate-500'
          }`}
        >
          {day}
          {hasWorkout && !isToday && (
            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500"></div>
          )}
        </div>
      );
    }
    
    return { days, monthName };
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-50 pb-28 overflow-x-hidden selection:bg-indigo-500/30" style={{ fontFamily: '"Outfit", sans-serif' }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;600;700;800;900&display=swap');
          body { font-family: 'Outfit', sans-serif; }
        `}
      </style>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-emerald-600/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <header className="relative z-10 px-6 pt-10 pb-6 flex justify-between items-center max-w-lg mx-auto">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
             
             
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
            Stenvo <span className="text-indigo-500"></span>
          </h1>
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-5 space-y-6">

        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

            {unlockedAchievements.length > 0 && (
              <GlassCard className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20" onClick={() => setActiveTab('account')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/20 rounded-xl"><Trophy className="text-purple-400" size={18} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-purple-400/60 tracking-wider">Succès débloqués</p>
                      <p className="text-xl font-black italic text-purple-400 leading-none">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-purple-500/50" />
                </div>
              </GlassCard>
            )}

            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><BarChart3 size={16} /></div>
                   <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Progression</p>
                </div>
                <Badge color="amber" icon={Calendar}>14J</Badge>
              </div>
              {analytics?.volumeChart.length > 0 ? (
                <SimpleChart data={analytics.volumeChart} />
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-700 border border-dashed border-slate-800 rounded-2xl">
                  <Activity size={24} className="opacity-20 mb-2" />
                  <p className="text-[8px] font-black uppercase tracking-widest italic">Commencez à vous entraîner</p>
                </div>
              )}
            </GlassCard>

            {supplements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                  <Pill size={14} className="text-indigo-500" /> Compléments Quotidiens
                </h3>
                <div className="grid gap-2">
                  {supplements.map(supp => {
                    const taken = isSupplementTakenToday(supp.id);
                    const colors = {
                      indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
                      emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
                      rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
                      amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
                      purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
                    };
                    return (
                      <div key={supp.id} className={`p-4 rounded-2xl border bg-gradient-to-r ${colors[supp.color] || colors.indigo} ${taken ? 'opacity-50' : ''}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs font-black text-white uppercase italic">{supp.name}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">{supp.dosage}</p>
                          </div>
                          <button
                            onClick={() => !taken && logSupplementIntake(supp.id)}
                            className={`p-2.5 rounded-xl transition-all ${
                              taken 
                                ? 'bg-emerald-500/20 text-emerald-500' 
                                : 'bg-slate-800 text-slate-400 active:scale-95'
                            }`}
                          >
                            {taken ? <Check size={16} /> : <Pill size={16} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                       }`}>#{i+1}</div>
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

            <GlassCard className="p-5 bg-gradient-to-br from-rose-500/10 to-pink-500/5 border-rose-500/20" onClick={() => setShowMetricsModal(true)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500/20 rounded-xl"><Scale className="text-rose-400" size={18} /></div>
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
                const colors = {
                  indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
                  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
                  rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
                  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
                  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
                };
                return (
                  <GlassCard key={p.id} className={`p-5 bg-gradient-to-br ${colors[p.color] || colors.indigo}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-black italic text-white uppercase tracking-tight leading-none mb-2">{p.name}</h4>
                        <div className="flex gap-1.5 flex-wrap">
                          <Badge color={p.color}>{p.exercises.length} EXOS</Badge>
                          <Badge color="slate">{p.exercises.reduce((acc, ex) => acc + Number(ex.sets), 0)} SÉRIES</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <button onClick={() => duplicateProgram(p)} className="flex-1 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                        <Copy size={12} /> Dupliquer
                      </button>
                      <button onClick={() => savePrograms(programs.filter(x => x.id !== p.id))} className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-all active:scale-95">
                        <Trash2 size={16} />
                      </button>
                      <button onClick={() => startWorkout(p)} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                        <Play size={18} fill="currentColor" />
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
              {programs.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-[2rem] text-slate-600">
                  <Dumbbell size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">Aucun programme créé</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'active-workout' && activeWorkout && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="flex items-center justify-between sticky top-4 z-20 bg-slate-950/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-xl">
               <div>
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">{activeWorkout.name}</h3>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-slate-500" />
                    <p className="text-lg font-black italic text-white tabular-nums">
                      {Math.floor((new Date() - activeWorkout.startTime) / 60000)}m
                    </p>
                  </div>
               </div>
               <button onClick={finishWorkout} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
                 <CheckCircle2 size={14} /> Terminer
               </button>
            </div>

            {isRestRunning && (
              <div className="fixed bottom-24 left-5 right-5 z-30 animate-in slide-in-from-bottom duration-300">
                <div className="bg-slate-900 border-t-4 border-indigo-500 rounded-3xl p-4 shadow-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500"><Timer size={24} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em]">Repos</p>
                      <p className="text-2xl font-black italic text-white tabular-nums">{formatTime(restTime)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setRestTime(prev => prev + 30)} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-300 active:scale-95">+30</button>
                     <button onClick={() => setIsRestRunning(false)} className="w-10 h-10 bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center active:scale-95"><X size={20} /></button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {activeWorkout.exercises.map((ex, idx) => (
                <GlassCard key={ex.id} className={`${ex.setsDone >= Number(ex.sets) ? 'opacity-60 border-emerald-500/30' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase italic tracking-tight">{ex.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Objectif: {ex.sets} séries x {ex.reps} reps</p>
                    </div>
                    {ex.setsDone >= Number(ex.sets) && <Badge color="emerald" icon={CheckCircle2}>Complété</Badge>}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                     <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase px-1">Poids (kg)</label>
                        <input 
                          type="number" 
                          value={ex.weight} 
                          onChange={(e) => updateExerciseInWorkout(ex.id, 'weight', e.target.value)}
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 px-3 text-sm font-black text-indigo-400 outline-none focus:border-indigo-500/50 transition-all"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase px-1">Répétitions</label>
                        <input 
                          type="number" 
                          value={ex.reps} 
                          onChange={(e) => updateExerciseInWorkout(ex.id, 'reps', e.target.value)}
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 px-3 text-sm font-black text-indigo-400 outline-none focus:border-indigo-500/50 transition-all"
                        />
                     </div>
                     <div className="flex flex-col justify-end">
                        <button 
                          onClick={() => incrementSet(ex.id)}
                          className={`w-full h-[40px] rounded-xl flex flex-col items-center justify-center transition-all ${
                            ex.setsDone >= Number(ex.sets) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
                          }`}
                        >
                          <span className="text-xs font-black tabular-nums">{ex.setsDone} / {ex.sets}</span>
                        </button>
                     </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <h3 className="font-black text-2xl italic uppercase tracking-tighter">Statistiques</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 size={14} className="text-indigo-500" />
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Volume Total</p>
                </div>
                <p className="text-2xl font-black italic text-white">{(analytics?.totalVolume / 1000).toFixed(1)}T</p>
              </GlassCard>
              
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={14} className="text-emerald-500" />
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Séances</p>
                </div>
                <p className="text-2xl font-black italic text-white">{analytics?.completedWorkouts || 0}</p>
              </GlassCard>
            </div>

            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-indigo-500" />
                <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Évolution Volume (14j)</p>
              </div>
              {analytics?.volumeChart.length > 0 ? (
                <SimpleChart data={analytics.volumeChart} />
              ) : (
                <div className="h-44 flex items-center justify-center text-slate-700">
                  <p className="text-[8px] font-black uppercase">Pas de données</p>
                </div>
              )}
            </GlassCard>

            {analytics?.categoryData.length > 0 && (
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={16} className="text-indigo-500" />
                  <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Répartition par Catégorie</p>
                </div>
                <PieChart data={analytics.categoryData} />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {analytics.categoryData.map((cat, i) => {
                    const colors = ['indigo', 'emerald', 'amber', 'rose', 'purple'];
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${colors[i % colors.length]}-500`}></div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{cat.name}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {analytics?.topExercises.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Top Exercices</h4>
                <div className="space-y-2">
                  {analytics.topExercises.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                      <span className="text-xs font-black text-white uppercase italic">{ex.name}</span>
                      <span className="text-xs font-black text-indigo-400">{ex.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analytics?.weightChart.length > 0 && (
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Scale size={16} className="text-rose-500" />
                  <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Évolution Poids</p>
                </div>
                <SimpleChart data={analytics.weightChart.map(d => ({ name: d.name, volume: d.weight }))} />
              </GlassCard>
            )}

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Historique des séances</h4>
              <div className="space-y-3">
                 {sessions.length > 0 ? (
                   Object.entries(sessions.reduce((acc, s) => {
                     const key = `${s.dateStr}-${s.category}`;
                     if (!acc[key]) acc[key] = [];
                     acc[key].push(s);
                     return acc;
                   }, {})).slice(0, 5).map(([key, logs], i) => (
                     <GlassCard key={i} className="p-4">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800/50">
                          <div>
                                                       <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">{logs[0].dateStr}</p>
                            <h4 className="text-sm font-black text-white italic uppercase tracking-tight">{logs[0].category}</h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-[8px] font-black text-slate-500 uppercase">Volume</p>
                              <p className="text-sm font-black text-white tabular-nums">{(logs.reduce((acc, l) => acc + l.volume, 0) / 1000).toFixed(1)}T</p>
                            </div>
                            <button 
                              onClick={() => deleteSession(key)}
                              className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-all active:scale-95"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {logs.map((log, j) => (
                            <div key={j} className="flex justify-between items-center text-[9px] font-bold text-slate-400 py-1">
                              <span className="text-slate-200 uppercase">{log.exercise}</span>
                              <span className="tabular-nums">{log.sets}×{log.reps} @ {log.weight}kg</span>
                            </div>
                          ))}
                        </div>
                     </GlassCard>
                   ))
                 ) : (
                   <div className="text-center p-20 opacity-20 italic font-black text-xs uppercase tracking-widest">Aucune donnée</div>
                 )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-2xl italic uppercase tracking-tighter">Calendrier</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-3 bg-slate-900 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-lg font-black uppercase italic">{renderCalendar().monthName}</h3>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-3 bg-slate-900 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                  <div key={i} className="text-[10px] font-black text-slate-600 uppercase">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {renderCalendar().days}
              </div>

              <GlassCard className="p-5">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500/20"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Entraînement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-indigo-500"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Aujourd'hui</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <h3 className="font-black text-2xl italic uppercase tracking-tighter">Mon Compte</h3>
            
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                  <UserIcon size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black text-white uppercase italic">{userProfile.name}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase">{userProfile.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase">Objectif</span>
                  <span className="text-xs font-black text-white uppercase">{userProfile.goal}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase">Notifications</span>
                  <button 
                    onClick={() => saveUserProfile({ ...userProfile, notifications: !userProfile.notifications })}
                    className={`w-12 h-6 rounded-full transition-all ${userProfile.notifications ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${userProfile.notifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Mes Compléments</h4>
                <button 
                  onClick={() => setShowAddSupplementModal(true)}
                  className="text-indigo-400 text-[10px] font-black uppercase flex items-center gap-1"
                >
                  <PlusCircle size={14}/> Ajouter
                </button>
              </div>
              
              <div className="space-y-2">
                {supplements.length > 0 ? supplements.map(supp => (
                  <div key={supp.id} className="bg-slate-800/30 border border-slate-700/30 p-4 rounded-2xl flex justify-between items-center group">
                    <div>
                      <p className="text-xs font-black text-white uppercase italic">{supp.name}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{supp.dosage} • {supp.frequency === 'daily' ? 'Quotidien' : supp.frequency}</p>
                    </div>
                    <button 
                      onClick={() => deleteSupplement(supp.id)}
                      className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                )) : (
                  <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-[2rem] text-slate-600">
                    <Pill size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Aucun complément ajouté</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Exercices Personnalisés</h4>
                <button 
                  onClick={() => setShowAddExerciseModal(true)}
                  className="text-indigo-400 text-[10px] font-black uppercase flex items-center gap-1"
                >
                  <PlusCircle size={14}/> Créer
                </button>
              </div>
              
              <div className="space-y-2">
                {customExercises.length > 0 ? customExercises.map(ex => (
                  <div key={ex.id} className="bg-slate-800/30 border border-slate-700/30 p-4 rounded-2xl flex justify-between items-center group">
                    <div>
                      <p className="text-xs font-black text-white uppercase italic">{ex.name}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{ex.category} • {ex.defaultWeight}kg × {ex.defaultReps} reps</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditExercise(ex)}
                        className="p-2 text-indigo-500"
                      >
                        <Edit size={16}/>
                      </button>
                      <button 
                        onClick={() => deleteCustomExercise(ex.id)}
                        className="p-2 text-rose-500"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-[2rem] text-slate-600">
                    <Dumbbell size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Aucun exercice personnalisé</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Succès Débloqués</h4>
              <div className="grid gap-2">
                {ACHIEVEMENTS.map(ach => {
                  const unlocked = achievements.includes(ach.id);
                  const Icon = ach.icon;
                  return (
                    <div 
                      key={ach.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        unlocked 
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border-indigo-500/30' 
                          : 'bg-slate-800/20 border-slate-800/30 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${unlocked ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                          <Icon size={18} className={unlocked ? 'text-indigo-400' : 'text-slate-600'} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-white uppercase italic">{ach.name}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">{ach.desc}</p>
                        </div>
                        {unlocked && <Check size={20} className="text-emerald-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/80 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl z-50">
        <NavItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={Dumbbell} label="Programmes" active={activeTab === 'programs'} onClick={() => setActiveTab('programs')} />
        <NavItem icon={CalendarDays} label="Calendrier" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
        <NavItem icon={BarChart3} label="Stats" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
        <NavItem icon={UserIcon} label="Compte" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
      </nav>

      {showAddSupplementModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md p-10 flex items-center justify-center animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto mb-6">
                <Pill size={40}/>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Nouveau Complément</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase px-2">Nom</label>
                <input 
                  type="text"
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic uppercase placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all"
                  placeholder="ex: WHEY PROTEIN"
                  value={newSupplement.name}
                  onChange={(e) => setNewSupplement({...newSupplement, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase px-2">Dosage</label>
                <input 
                  type="text"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic uppercase placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all"
                  placeholder="ex: 1 SCOOP"
                  value={newSupplement.dosage}
                  onChange={(e) => setNewSupplement({...newSupplement, dosage: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase px-2">Fréquence</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic uppercase outline-none focus:border-indigo-500 transition-all"
                  value={newSupplement.frequency}
                  onChange={(e) => setNewSupplement({...newSupplement, frequency: e.target.value})}
                >
                  <option value="daily">Quotidien</option>
                  <option value="training">Jours d'entraînement</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase px-2">Couleur</label>
                <div className="flex gap-3 px-2">
                  {['indigo', 'emerald', 'rose', 'amber', 'purple'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setNewSupplement({...newSupplement, color: c})}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${
                        newSupplement.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40'
                      }`}
                      style={{ backgroundColor: `var(--color-${c}, ${
                        c === 'indigo' ? '#6366f1' : c === 'emerald' ? '#10b981' : c === 'rose' ? '#f43f5e' : c === 'amber' ? '#f59e0b' : '#a855f7'
                      })` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAddSupplementModal(false)} className="flex-1 py-4 bg-slate-900 text-slate-500 rounded-2xl font-black uppercase tracking-widest active:scale-95">Annuler</button>
              <button onClick={handleAddSupplement} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95">Créer</button>
            </div>
          </div>
        </div>
      )}

      {showAddExerciseModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md p-10 flex items-center justify-center animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto mb-6">
                <Dumbbell size={40}/>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Nouvel Exercice</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase px-2">Nom de l'exercice</label>
                <input 
                  type="text"
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic uppercase placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all"
                  placeholder="ex: SQUAT BULGARE"
                  value={newCustomExercise.name}
                  onChange={(e) => setNewCustomExercise({...newCustomExercise, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase px-2">Catégorie</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic uppercase outline-none focus:border-indigo-500 transition-all"
                  value={newCustomExercise.category}
                  onChange={(e) => setNewCustomExercise({...newCustomExercise, category: e.target.value})}
                >
                  <option value="Personnalisé">Personnalisé</option>
                  {Object.keys(EXERCISE_LIBRARY).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase px-2">Poids (kg)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic outline-none focus:border-indigo-500 transition-all"
                    value={newCustomExercise.defaultWeight}
                    onChange={(e) => setNewCustomExercise({...newCustomExercise, defaultWeight: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase px-2">Reps</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic outline-none focus:border-indigo-500 transition-all"
                    value={newCustomExercise.defaultReps}
                    onChange={(e) => setNewCustomExercise({...newCustomExercise, defaultReps: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAddExerciseModal(false)} className="flex-1 py-4 bg-slate-900 text-slate-500 rounded-2xl font-black uppercase tracking-widest active:scale-95">Annuler</button>
              <button onClick={handleAddCustomExercise} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95">Créer</button>
            </div>
          </div>
        </div>
      )}

      {showEditExerciseModal && editingExercise && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md p-10 flex items-center justify-center animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto mb-6">
                <Edit size={40}/>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Modifier l'Exercice</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase px-2">Nom de l'exercice</label>
                <input 
                  type="text"
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic uppercase placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all"
                  value={editingExercise.name}
                  onChange={(e) => setEditingExercise({...editingExercise, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase px-2">Catégorie</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic uppercase outline-none focus:border-indigo-500 transition-all"
                  value={editingExercise.category}
                  onChange={(e) => setEditingExercise({...editingExercise, category: e.target.value})}
                >
                  <option value="Personnalisé">Personnalisé</option>
                  {Object.keys(EXERCISE_LIBRARY).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase px-2">Poids (kg)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic outline-none focus:border-indigo-500 transition-all"
                    value={editingExercise.defaultWeight}
                    onChange={(e) => setEditingExercise({...editingExercise, defaultWeight: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase px-2">Reps</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black italic outline-none focus:border-indigo-500 transition-all"
                    value={editingExercise.defaultReps}
                    onChange={(e) => setEditingExercise({...editingExercise, defaultReps: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowEditExerciseModal(false); setEditingExercise(null); }} className="flex-1 py-4 bg-slate-900 text-slate-500 rounded-2xl font-black uppercase tracking-widest active:scale-95">Annuler</button>
              <button onClick={handleEditCustomExercise} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {showProgramModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md p-6 flex flex-col animate-in fade-in duration-300">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Nouveau Programme</h2>
              <button onClick={() => setShowProgramModal(false)} className="p-2 bg-slate-900 rounded-full text-slate-400"><X /></button>
           </div>
           
           <div className="space-y-6 flex-1 overflow-y-auto pb-10">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Nom du programme</label>
                <input 
                  autoFocus
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-white font-black italic uppercase placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all"
                  placeholder="ex: PUSH DAY ELITE"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Couleur thématique</label>
                <div className="flex gap-3 px-2">
                  {['indigo', 'emerald', 'rose', 'amber', 'purple'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setNewProgram({...newProgram, color: c})}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${
                        newProgram.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40'
                      }`}
                      style={{ backgroundColor: `var(--color-${c}, ${
                        c === 'indigo' ? '#6366f1' : c === 'emerald' ? '#10b981' : c === 'rose' ? '#f43f5e' : c === 'amber' ? '#f59e0b' : '#a855f7'
                      })` }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center px-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Exercices ({newProgram.exercises.length})</label>
                    <button onClick={() => setShowExerciseLibrary(true)} className="text-indigo-400 text-[10px] font-black uppercase flex items-center gap-1"><PlusCircle size={14}/> Ajouter</button>
                 </div>
                 
                 <div className="space-y-2">
                    {newProgram.exercises.map((ex, i) => (
                      <div key={ex.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-black">{i+1}</div>
                            <div>
                               <p className="text-xs font-black text-white uppercase italic">{ex.name}</p>
                               <p className="text-[9px] font-bold text-slate-500 uppercase">{ex.sets} séries x {ex.reps} reps</p>
                            </div>
                         </div>
                         <button onClick={() => setNewProgram(prev => ({...prev, exercises: prev.exercises.filter(x => x.id !== ex.id)}))} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <button 
            onClick={handleCreateProgram}
            className={`w-full py-5 rounded-[2rem] font-black uppercase italic tracking-widest transition-all ${
              newProgram.name && newProgram.exercises.length > 0 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 active:scale-95' : 'bg-slate-900 text-slate-700 pointer-events-none'
            }`}
           >
             Créer le programme
           </button>
        </div>
      )}

      {showExerciseLibrary && (
        <div className="fixed inset-0 z-[110] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-right duration-300">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Bibliothèque</h2>
              <button onClick={() => setShowExerciseLibrary(false)} className="p-2 bg-slate-900 rounded-full text-slate-400"><X /></button>
           </div>
           
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 pl-12 text-white font-black italic uppercase placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all"
                placeholder="Chercher un mouvement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>

           <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {['Tous', ...Object.keys(EXERCISE_LIBRARY), 'Personnalisé'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                    selectedCategory === cat ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>

           <div className="flex-1 overflow-y-auto space-y-2 pt-2">
              {filteredExercises.map((ex, i) => (
                <button 
                  key={i} 
                  onClick={() => addExerciseToProgram(ex)}
                  className="w-full p-4 bg-slate-900/50 border border-slate-800/30 rounded-2xl flex justify-between items-center hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  <div className="text-left">
                    <span className="text-xs font-black text-white uppercase italic block">{ex.name}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{ex.category}</span>
                  </div>
                  <Plus size={16} className="text-indigo-500" />
                </button>
              ))}
           </div>
        </div>
      )}

      {showMetricsModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md p-10 flex items-center justify-center animate-in zoom-in-95 duration-200">
           <div className="w-full max-w-sm space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto mb-6"><Scale size={40}/></div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Mesures du jour</h3>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase px-2">Poids Corporel (kg)</label>
                    <input 
                      type="number"
                      autoFocus
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-xl font-black italic outline-none focus:border-rose-500 transition-all"
                      placeholder="0.0"
                      value={newMetric.weight}
                      onChange={(e) => setNewMetric({...newMetric, weight: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase px-2">Masse Grasse (%) - Optionnel</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-xl font-black italic outline-none focus:border-rose-500 transition-all"
                      placeholder="0"
                      value={newMetric.bodyFat}
                      onChange={(e) => setNewMetric({...newMetric, bodyFat: e.target.value})}
                    />
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowMetricsModal(false)} className="flex-1 py-4 bg-slate-900 text-slate-500 rounded-2xl font-black uppercase tracking-widest active:scale-95">Annuler</button>
                 <button onClick={addMetric} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-600/20 active:scale-95">Enregistrer</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}