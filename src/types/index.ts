export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'secretary' | 'member';
  github?: string;
  linkedin?: string;
  workStatus: 'free' | 'busy' | 'rest';
}

export interface MOM {
  id: string;
  title: string;
  date: string;
  participants: string[];
  summary: string;
  decisions: string[];
  createdBy: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  agenda: string;
  meetingLink?: string;
  createdBy: string;
}

export interface FormLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'registration' | 'feedback' | 'github' | 'other';
  createdBy: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'ongoing' | 'completed';
  startDate: string;
  endDate?: string;
  createdBy: string;
}