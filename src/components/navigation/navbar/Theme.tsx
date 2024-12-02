"use client";

import {useTheme} from "next-themes";
import {HiMoon, HiSun} from "react-icons/hi";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Theme = () => {
  const {setTheme} = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <HiSun className="rotate-0 scale-[115%] transition-all dark:-rotate-90 dark:scale-0" />
          <HiMoon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-[115%]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="light-border min-w-24 border bg-light-800 dark:bg-dark-200"
      >
        <DropdownMenuItem onClick={() => setTheme("light")} className="px-3">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="px-3">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="px-3">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Theme;
