export type Profile = {
    id: string;
    slug: string;
    name: string;
    title: string;
    skills: Array<{ name: string; level: number }>;
    introduction?: string;
    github?: string;
    linkedin?: string;
    personal_link?: string;
    created_at: string;
}