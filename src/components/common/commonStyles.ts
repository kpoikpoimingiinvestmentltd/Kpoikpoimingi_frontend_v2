import { twMerge } from "tailwind-merge";

export const inputStyle =
	"border border-stone-400/50 text-sm sm:text-[.975rem] rounded-sm py-2 h-11 w-full focus:outline-none ring-1 ring-transparent bg-white ring-offset-1 placeholder:text-sm focus-visible:border-stone-400 focus-visible:ring-primary focus-visible:ring-1  bg-[#13121205]";

export const switchStyle = "data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300";

export const checkboxStyle =
	"data-[state=checked]:bg-primary bg-stone-50 w-5 h-5 border-stone-300 shadow-none data-[state=checked]:border-primary transition duration-300 ease-in-out";

export const actionBtnStyle =
	"h-12 rounded-sm bg-primary w-full p-4 text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center text-[.925rem]";

export const preTableButtonStyle = "text-sm active-scale flex py-2 h-10 px-3 rounded-sm items-center justify-center gap-1.5 text-black";

export const smBtnStyle = "bg-primary justify-center items-center text-[.8rem] rounded-sm py-1.5 px-2 text-white leading-tight active-scale flex";

export const tableHeaderRowStyle = "bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg [&_tr]:border-0";

export const tabStyle =
	"data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:underline underline-offset-[6px] text-[.9rem] justify-start p-0 justify-start disabled:cursor-not-allowed disabled:opacity-50";

export const tabListStyle = "bg-transparent flex-wrap gap-5 p-0 h-auto";

export const labelStyle = (style?: string) => {
	return twMerge("text-sm block mb-1.5 text-slate-800", style);
};

export const selectTriggerStyle = (style?: string) => {
	return twMerge(inputStyle, "min-h-11", style);
};

export const modalContentStyle = (style?: string) => {
	return twMerge("overflow-y-auto max-h-[90vh] md:max-w-2xl w-full", style);
};
