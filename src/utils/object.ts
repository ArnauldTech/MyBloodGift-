

import { HeartPulse, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";


export const CardObject =[
    {
        title:"+3200",
         description:"Donneurs actifs",
          color:"bg-white text-slate-900",
          className:""
    },
     {
        title:"+3200",
         description:"Banques de sang",
          color:"bg-gradient-to-br from-red-500 to-red-700 ",
          className:"text-base md:text-lg font-normal text-white text-center"
    },
 {
        title:"98%",
         description:"Réponse rapide",
          color:"bg-white text-slate-900",
          className:""
    }

]

export const DescriptiveCardObject = [
    {
         title:"Mobilisation citoyenne",
         url:"src/assets/react.svg",
         position:"",
         className:"h-56 rounded-[1.5rem] border border-slate-200",
         description:"Suivez les poches de sang et les mouvements entre les centres depuis une interface claire." 
    },
    {
         title:"Mobilisation citoyenne",
         url:"src/assets/react.svg",
         position:"top-5 right-5 opacity-60",
         className:"h-56 rounded-[1.5rem] border border-slate-200",
         description:"Diffusez les campagnes et les alertes aux donneurs proches de votre zone." 
    },

]
type Pngprops = {
    icon:LucideIcon,
    title:string,
    description:string,
    iclass:string
  
};

export const PngCardObject :Pngprops[]= [
    {
         icon: Users,
         iclass:`h-10 w-10 text-red-600 group-hover:text-white`,
         title:"Inscription",
         description:"Créez un compte en quelques minutes."
    },
    {
         icon: ShieldCheck,
         iclass:`h-10 w-10 text-red-600 group-hover:text-white`,
         title:"Alertes",
         description:"Recevez les besoins de votre groupe sanguin."
    },
    {
         icon: Sparkles,
         iclass:`h-10 w-10 text-red-600 group-hover:text-white`,
         title:"Réponse",
         description:"Répondez rapidement aux demandes locales."
    },
    {
         icon: HeartPulse,
         iclass:`h-10 w-10 text-red-600 group-hover:text-white`,
         title:"Don",
         description:"Participez à sauver des vies."
    },
]

export const questionCardObject = [
    {
        question:"Comment faire un don de sang ?",
        answer:"Prenez rendez-vous dans un centre partenaire et suivez les consignes avant la collecte."
    },
    {
        question:"Qui peut recevoir des alertes ?",
        answer:"Tous les donneurs inscrits reçoivent des alertes selon leur groupe sanguin et leur localisation."
    },
    {
        question:"Mes données sont-elles protégées ?",
        answer:"Oui, les informations restent privées et sont utilisées uniquement pour le suivi du don."
    }
]
