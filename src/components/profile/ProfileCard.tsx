import Image from "next/image";
import { User } from "lucide-react";
import { Project } from "@/types/LocalTypes";

interface ProfileDataProps {
  name: string;
  title: string;
  introduction?: string;
  github?: string;
  linkedin?: string;
  personal_link?: string;
  projects?: Project[];
  colorProfile: string; // added color profile to the type
}

const ProfileCard = ({
  data,
  colorProfile,
}: {
  data: ProfileDataProps | null;
  colorProfile: string;
}) => {
  return (
    <>
      <div
        className={`${
          colorProfile === "light"
            ? "bg-white text-black border-gray-300"
            : "bg-white/5 text-white border-white/10"
        } backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full shadow-xl`}
      >
        {data ? (
          <>
            <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
            <p className="text-lg text-blue-400 font-medium">{data.title}</p>

            <p
              className={`"mt-4 leading-relaxed whitespace-pre-wrap" ${
                colorProfile === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {data.introduction || "No introduction provided."}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 w-full">
              {data.github && (
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
                  title="GitHub"
                >
                  <Image
                    src="/icons/github.svg"
                    alt="GitHub"
                    width={24}
                    height={24}
                    className="opacity-90 shrink-0"
                  />
                  <span className={
                    "text-sm truncate" + (colorProfile === "light" ? " text-gray-700" : " text-gray-300")
                  }
                  >GitHub</span>
                </a>
              )}

              {data.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto" 
                  title="LinkedIn"
                >
                  <Image
                    src="/icons/linkedin.svg"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    className="opacity-90 shrink-0"
                  />
                  <span className={
                    "text-sm truncate" + (colorProfile === "light" ? " text-gray-700" : " text-gray-300")
                  }
                  >LinkedIn</span>
                </a>
              )}

              {data.personal_link && (
                <a
                  href={data.personal_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
                  title="Personal Website"
                >
                  <User size={20} className="opacity-90 shrink-0" />
                  <span className={
                    "text-sm truncate" + (colorProfile === "light" ? " text-gray-700" : " text-gray-300")
                  }>Website</span>
                </a>
              )}
            </div>
          </>
        ) : (
          <p className="text-zinc-400">Loading profile…</p>
        )}
      </div>
    </>
  );
};

export default ProfileCard;
