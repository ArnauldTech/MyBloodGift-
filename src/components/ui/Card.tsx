import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import React, { useState } from "react";
import {cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";


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

type WidgetCard={
    logo:LucideIcon,
    title:string,
    onClick?: () => void
}

const WidgetVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:text-white hover:bg-linear-to-r hover:from-blue-400 hover:to-blue-700  aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 cursor-pointer",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: 
        "text-primary underline-offset-4 hover:underline",
        primary:
          "bg-linear-to-r from-red-500 to-red-700 text-white hover:from-red-400 hover:to-red-800 cursor-pointer",
        secondary:
          "bg-linear-to-r from-blue-500 to-blue-700 text-white hover:from-blue-400 hover:to-blue-800",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-6 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export function Widget
({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  logo,
  title,
  onClick,
}: React.ComponentProps<"button"> &
  VariantProps<typeof WidgetVariants> & {
    asChild?: boolean
  }& WidgetCard){
    const Comp = asChild ? Slot.Root : "button"
    return(
        <Comp className={cn(WidgetVariants({variant,size,className}))}
        datta-slot="button"
        data-variant={variant}
        data-size={size}
        onClick={onClick}>
            {logo && React.createElement(logo, { className: "h-4 w-4 shrink-0 text-current" })}
            <span className="truncate">{title}</span>
        </Comp>
    )
}
