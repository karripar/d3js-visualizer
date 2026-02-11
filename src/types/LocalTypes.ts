export type Profile = {
    id: string;
    slug: string;
    name: string;
    title: string;
    skills: Array<{ name: string; level: number }>;
    introduction?: string;
    github?: string;
    linkedin?: string;
    created_at: string;
}