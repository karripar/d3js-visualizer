export type Project = {
    title: string;
    description: string;
    link?: string;
    technologies?: string;
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
}