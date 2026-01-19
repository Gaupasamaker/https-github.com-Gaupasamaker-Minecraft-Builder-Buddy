import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Re-defining types here to avoid circular dependencies or complex imports
// Ideally these should be in a shared types file
export interface Step {
  instruction: string;
  tip: string;
}

export interface BuildGuide {
  materials: string[];
  steps: Step[];
}

export interface Idea {
  title: string;
  description: string;
  visualPrompt: string;
  isRealWorld: boolean;
  image?: string;
  guide?: BuildGuide; // Guide is optional initially, but required for saved favorites
  id?: string; // Unique ID for saved items
  timestamp?: number;
}

export interface Achievement {
  id: string;
  unlockedAt?: number;
}

interface StorageContextType {
  favorites: Idea[];
  achievements: Achievement[];
  xp: number;
  addFavorite: (idea: Idea) => void;
  removeFavorite: (id: string) => void;
  completeBuild: (category?: string) => { xpGained: number, newAchievements: string[] };
  isFavorite: (title: string) => boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const XP_PER_BUILD = 50;

export function StorageProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('mbb_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('mbb_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('mbb_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedBuilds, setCompletedBuilds] = useState<number>(() => {
    const saved = localStorage.getItem('mbb_completed_builds');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mbb_category_counts');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('mbb_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('mbb_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('mbb_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('mbb_completed_builds', completedBuilds.toString());
  }, [completedBuilds]);

  useEffect(() => {
    localStorage.setItem('mbb_category_counts', JSON.stringify(categoryCounts));
  }, [categoryCounts]);

  const addFavorite = (idea: Idea) => {
    if (favorites.some(f => f.title === idea.title)) return;
    const newFavorite = { ...idea, id: crypto.randomUUID(), timestamp: Date.now() };
    setFavorites(prev => [...prev, newFavorite]);
    checkAchievements('save', [...favorites, newFavorite].length);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const isFavorite = (title: string) => {
    return favorites.some(f => f.title === title);
  };

  const checkAchievements = (
    type: 'build' | 'save' | 'level', 
    count: number, 
    category?: string, 
    catCount?: number
  ): string[] => {
    const newUnlocked: string[] = [];
    const currentIds = new Set(achievements.map(a => a.id));

    const unlock = (id: string) => {
      if (!currentIds.has(id)) {
        newUnlocked.push(id);
        setAchievements(prev => [...prev, { id, unlockedAt: Date.now() }]);
      }
    };

    if (type === 'build') {
      if (count >= 1) unlock('first_build');
      if (count >= 3) unlock('three_builds');
      if (count >= 10) unlock('master_builder');
      if (count >= 25) unlock('marathon_runner');
      if (count >= 50) unlock('centurion');

      if (category && catCount) {
        if (category === 'house') {
          if (catCount >= 3) unlock('wood_master');
          if (catCount >= 10) unlock('architect');
        }
        if (category === 'monument') {
          if (catCount >= 3) unlock('stone_mason');
          if (catCount >= 10) unlock('sculptor');
        }
        if (category === 'redstone') {
          if (catCount >= 3) unlock('redstone_engineer');
          if (catCount >= 10) unlock('tech_wizard');
        }
        if (category === 'garden') {
          if (catCount >= 3) unlock('green_thumb');
          if (catCount >= 10) unlock('nature_lover');
        }
        if (category === 'vehicle') {
          if (catCount >= 3) unlock('mechanic');
          if (catCount >= 10) unlock('pilot');
        }
        if (category === 'fantasy') {
          if (catCount >= 3) unlock('dream_builder');
          if (catCount >= 10) unlock('fantasy_lord');
        }
      }
    }

    if (type === 'save') {
      if (count >= 5) unlock('idea_collector');
      if (count >= 10) unlock('idea_hoarder');
      if (count >= 20) unlock('library_curator');
    }

    if (type === 'level') {
      if (count >= 5) unlock('dedicated');
      if (count >= 10) unlock('expert');
      if (count >= 20) unlock('elite');
      if (count >= 50) unlock('legendary');
    }

    return newUnlocked;
  };

  const completeBuild = (category?: string) => {
    const newCount = completedBuilds + 1;
    setCompletedBuilds(newCount);
    
    const newXp = xp + XP_PER_BUILD;
    setXp(newXp);
    
    let newCatCount = 0;
    if (category) {
      newCatCount = (categoryCounts[category] || 0) + 1;
      setCategoryCounts(prev => ({ ...prev, [category]: newCatCount }));
    }

    const unlockedBuild = checkAchievements('build', newCount, category, newCatCount);
    
    // Check level achievements
    const level = Math.floor(newXp / 100) + 1;
    const unlockedLevel = checkAchievements('level', level);

    return { xpGained: XP_PER_BUILD, newAchievements: [...unlockedBuild, ...unlockedLevel] };
  };

  return (
    <StorageContext.Provider value={{ favorites, achievements, xp, addFavorite, removeFavorite, completeBuild, isFavorite }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
}
