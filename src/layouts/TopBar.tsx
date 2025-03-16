import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { ButtonV2 } from "../components/buttons/ButtonV2";

export function TopBar() {
    return (
        <header className="sticky top-0 z-10 bg-base-950
          h-14 flex border-b border-base-800 divide-x divide-base-800">
            
            <Link to="/" 
                className="flex items-center px-4
                    text-base-200 font-display font-medium uppercase
                    [&:hover,&:focus]:text-base-100
                    [&:hover,&:focus]:bg-base-900
                    [&:hover:active,&:focus:active]:bg-base-800
                    [&:focus-visible]:outline-1 [&:focus-visible]:outline-offset-0 [&:focus-visible]:outline-base-400
                    transition-colors duration-80">
                FOM
            </Link>
        
            <div className="flex flex-1 px-4 items-center gap-2
                font-display text-base-500 uppercase">
                <Search size={16} strokeWidth={1.75}/>Search...
            </div>
        
            {/* <div className="flex items-center px-4 gap-2
                text-base-400 font-display uppercase">
                New structure
                <div className="flex w-4 h-4 text-xs items-center justify-center
                    border border-base-600
                    text-base-500">
                    N
                </div>
            </div> */}

            <ButtonV2 variant="topBar" className="px-4 gap-2">
                New Structure
                <div className="flex w-4 h-4 text-xs items-center justify-center
                    border border-base-600
                    text-base-500">
                    N
                </div>
            </ButtonV2>
        
            <div className="flex w-14 items-center justify-center
                text-base-400 font-display uppercase">
                TC
            </div>
        
        </header>
    )
}