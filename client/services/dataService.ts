// Data persistence service for SBIE CRM
// This service handles loading and saving application data to localStorage

export interface Student {
  id: string;
  nome: string;
  celular: string;
  email: string;
  treinamento: string;
}

export interface Training {
  id: string;
  name: string;
  description: string;
  students: number;
  status: "active" | "inactive" | "planned";
  startDate: string;
  duration: string;
  instructor: string;
}

export interface Activity {
  id: string;
  type: "student_added" | "student_deleted" | "csv_imported" | "student_edited" | "training_added" | "training_deleted" | "training_edited";
  message: string;
  timestamp: Date;
  details?: string;
}

// Students data management
export const studentsService = {
  getAll: (): Student[] => {
    try {
      const stored = localStorage.getItem('sbie-students');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading students from localStorage:', error);
      return [];
    }
  },

  save: (students: Student[]): void => {
    try {
      localStorage.setItem('sbie-students', JSON.stringify(students));
    } catch (error) {
      console.error('Error saving students to localStorage:', error);
    }
  },

  clear: (): void => {
    localStorage.removeItem('sbie-students');
  }
};

// Trainings data management
export const trainingsService = {
  getAll: (): Training[] => {
    try {
      const stored = localStorage.getItem('sbie-trainings');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading trainings from localStorage:', error);
      return [];
    }
  },

  save: (trainings: Training[]): void => {
    try {
      localStorage.setItem('sbie-trainings', JSON.stringify(trainings));
    } catch (error) {
      console.error('Error saving trainings to localStorage:', error);
    }
  },

  clear: (): void => {
    localStorage.removeItem('sbie-trainings');
  }
};

// Activities data management
export const activitiesService = {
  getAll: (): Activity[] => {
    try {
      const stored = localStorage.getItem('sbie-activities');
      if (stored) {
        const activities = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return activities.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading activities from localStorage:', error);
      return [];
    }
  },

  save: (activities: Activity[]): void => {
    try {
      localStorage.setItem('sbie-activities', JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
    }
  },

  add: (activity: Omit<Activity, 'id' | 'timestamp'>): Activity => {
    const newActivity: Activity = {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    const currentActivities = activitiesService.getAll();
    const updatedActivities = [newActivity, ...currentActivities.slice(0, 49)]; // Keep only last 50 activities
    activitiesService.save(updatedActivities);
    
    return newActivity;
  },

  clear: (): void => {
    localStorage.removeItem('sbie-activities');
  }
};

// Settings data management
export const settingsService = {
  get: () => {
    try {
      const stored = localStorage.getItem('sbie-settings');
      return stored ? JSON.parse(stored) : {
        organizationName: 'SBIE - Sistema Brasileiro de Inteligência Emocional',
        email: 'contato@sbie.com.br',
        phone: '(11) 9999-9999',
        address: 'São Paulo, SP - Brasil',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        security: {
          twoFactor: false,
          sessionTimeout: 30,
        },
        appearance: {
          theme: 'light',
          language: 'pt-BR',
        },
      };
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return {};
    }
  },

  save: (settings: any): void => {
    try {
      localStorage.setItem('sbie-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  },

  clear: (): void => {
    localStorage.removeItem('sbie-settings');
  }
};

// Clear all application data (used on logout)
export const clearAllData = (): void => {
  studentsService.clear();
  trainingsService.clear();
  activitiesService.clear();
  settingsService.clear();
};
