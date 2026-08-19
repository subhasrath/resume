export interface PersonalInfo {
  name: string;
  shortName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  summary: string;
  availability: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface Project {
  name: string;
  period: string;
  company: string;
  description: string;
  details: string[];
  technologies: string[];
  github?: string;
  live?: string;
  featured?: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  year: string;
  grade: string;
  description?: string;
}

export interface SkillGroup {
  name: string;
  skills: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  skills: SkillGroup[];
  projects: Project[];
  education: Education[];
  languages: string[];
  interests: string[];
}
