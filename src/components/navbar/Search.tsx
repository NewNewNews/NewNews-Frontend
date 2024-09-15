"use client";

import { BiSearch } from "react-icons/bi";

export default function Search() {
    return(
        <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer dark:bg-black">
            <div className="flex flex-row items-center justify-between pr-2">
                <div className="text-sm font-semibold px-6 dark:text-white">
                    AnyNews
                </div>
                <div className="p-1 bg-black dark:bg-white rounded-full text-white dark:text-black">
                    <BiSearch size={18}/>
                </div>
            </div>
        </div>
    )
}
