
import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex justify-start">
        <h1 className="font-semibold text-lg">Restaurant 😋</h1>
      </div>
      
      <div className="flex-1 flex justify-center max-w-md w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-full pl-10 bg-background border-border rounded-full"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
            3
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-savory-100 text-savory-800 text-sm">JS</AvatarFallback>
              </Avatar>
              <div className="text-sm text-left hidden sm:block">
                <div className="font-medium">Jhon Smith</div>
                <div className="text-xs text-muted-foreground">User</div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
