
export type Project = {
    title: string;
    description: string;
    link?: string;
    technologies?: string;
}


export type JobExperience = {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description?: string;
}


export type Profile = {
    id: string;
    user_id: string;
    slug: string;
    name: string;
    title: string;
    skills: Array<{ name: string; level: number }>;
    introduction?: string;
    github?: string;
    linkedin?: string;
    personal_link?: string;
    projects?: Project[];
    created_at: string;
    colorProfile?: string; // optional field for color profile
    experiences: JobExperience[]; // added experience field
}