import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import React, { useState } from "react";


type CardsProps = {
    title?: string,
    description?: string,
    className?: string,
    color?:string,
}

function Card({ title, description, className,color }: CardsProps) {
    return (
        <div className={`rounded-xl shadow-md hover:shadow-lg ${color || "bg-white" } flex flex-col justify-center items-center gap-4 p-6 md:p-8 h-48 md:h-56 w-full transition-shadow duration-300`}>
            {title && (
                <h3 className="text-red-600 text-lg md:text-xl font-bold text-center">{title}</h3>
            )}
            <p className={`${className || "text-base md:text-lg font-normal text-gray-600 text-center"}`}>
                {description || "Contenu par défaut"}
            </p>
        </div>
    )
}
export default Card;

type CardProps = {
    className?: string,
    title: string,
    url?: string,
    description?: string,
    status?: string,
    information?: string,
    color?: string,
    position?: string,
    icon?: LucideIcon,
    iclass?:string
}

export function EmergencyCard({ className, title, url, description, status, information }: CardProps) {
    return (
        <div className={`${className} bg-linear-to-br from-red-500 to-red-700 rounded-lg px-6 py-6 md:p-8 flex flex-col gap-20 md:gap-12 transition-transform duration-300 cursor-pointer hover:shadow-xl hover:scale-105`}>
            <div className="flex items-start justify-between gap-4">
                {url && <img src={url} alt={description|| ""} className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-100 hover:scale-110" />}
                {status && <div className="bg-white/20 backdrop-blur-md rounded-full px-3 md:px-4 py-1 text-xs md:text-sm font-semibold text-white whitespace-nowrap">{status}</div>}
            </div>
            <div className="flex flex-col gap-2 md:gap-3">
                {title && <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>}
                <p className="text-sm md:text-base text-white/80 leading-relaxed">{information}</p>
            </div>
        </div>
    )
}



export function IllustrativeCard({ className, title, url, description, status}: CardProps) {
    return (
        <div className={`${className} rounded-lg relative overflow-hidden cursor-pointer group transition-transform duration-300 hover:shadow-xl`}>
            <img src={url} alt={title || ""} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className={`absolute inset-0 w-full h-full bg-linear-to-t from-black via-black/40 to-transparent`} />
            <div className="flex flex-col gap-3 p-4 md:p-6 items-start absolute bottom-0 w-full">
                <div className="flex items-center gap-2">
                    {status && <img src={status} alt="" className="w-8 h-8 md:w-10 md:h-10 object-contain" />}
                    <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
                </div>
                <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-sm">{description}</p>
            </div>
        </div>
    )
}
export function DescriptiveCard({ title, description, className,color,url,position}: CardProps) {
    return (
        <div className={` relative ${className} rounded-xl shadow-md hover:shadow-lg ${color || "bg-white" } flex flex-col justify-between gap-2 md:gap-4 p-6 md:p-8 h-48 md:h-56 w-full transition-shadow duration-300`}>
            {url && <img src={url} alt={description || ""} className={` absolute ${position || "top-5 left-5"} w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-100 hover:scale-110`} />}
            <div className="w-full mt-[20%] sm:mt-[17%] md:mt-[15%]">
                {title && (
                <h3 className="text-red-600 text-lg md:text-xl font-bold  ">{title}</h3>
            )}
            <p className={` text-base md:text-lg font-normal text-gray-600  "`}>
                {description || "Contenu par défaut"}
            </p>
            </div>
        </div>
    )
}

export function PngCard({title,description,icon,iclass}:CardProps )
{
    return(
        <div className="flex flex-col gap-2 justify-center items-center p-2 group cursor-pointer ">
            <div className="w-25 h-25 md:h-25 flex items-center justify-center rounded-lg overflow-hidden p-2 shadow-2xl  group-hover:bg-primary ">
                {icon && React.createElement(icon, { className: iclass || "h-10 w-10 text-red-600 " })}
                {/* <img src={URL.createObjectURL(icon)} alt={title} className="w-full h-full object-cover" /> */}
            </div>
            <h3 className="text-2xl font-semibold text-primary">{title}</h3>
            <p className="text-center ">{description}</p>
        </div>
    )

}

type categorieCard =
{
    className:string;
    children: React.ReactNode;
    categorie:string;
};

export function CategorieCard({className,children,categorie}:categorieCard)
{
    return(
        <div className={`${className} flex gap-2 rounded-lg p-2 border boder-primary outline-1 outline-primary bg-white hover:bg-primary/50 `}>
             {children}
             <p className="bg-gray-500 text-xs font-semibold">{categorie}</p>
        </div>
    )
}

type questionCard ={

    question:string,
    answer:string,
}

export function QuestionCard({question, answer}:questionCard)
{
    const [open,SetOpen] = useState(false);
    return(
        <div className="rounded-lg border flex flex-col gap-2 p-2">
            <div className="flex gap-3 justify-center items-center">
                <p className="text-xl font-semibold">{question}</p>
               {open ? <ChevronUp onClick={()=>SetOpen(!open)}/> :<ChevronDown onClick={()=>SetOpen(!open)}/>} 
            </div>
            {open && 
            <div>{answer}</div>
            }

        </div>
    )
}
