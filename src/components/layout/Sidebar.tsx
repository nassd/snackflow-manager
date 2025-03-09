import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  UtensilsCrossed, 
  Heart, 
  MessageSquare, 
  Clock, 
  Bell, 
  Receipt, 
  ChefHat, 
  Menu as MenuIcon, 
  Users, 
  Settings
} from "lucide-react";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  hasChildren?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  to, 
  active = false, 
  hasChildren = false, 
  expanded = false,
  onClick 
}: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
        active 
          ? "text-savory-500 bg-savory-50 font-medium" 
          : "text-foreground/80 hover:bg-savory-50/50 hover:text-savory-500"
      )}
      onClick={onClick}
    >
      <Icon className={cn(
        "h-5 w-5 shrink-0",
        active ? "text-savory-500" : "text-muted-foreground group-hover:text-savory-500"
      )} />
      <span>{label}</span>
      {hasChildren && (
        <span className="ml-auto">
          <ChevronIcon expanded={expanded} />
        </span>
      )}
    </Link>
  );
};

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(
      "transition-transform duration-200",
      expanded ? "transform rotate-180" : ""
    )}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function Sidebar() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    restaurant: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-savory-500 text-white">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <span className="font-semibold text-lg text-savory-600">Savory</span>
      </div>
      
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-savory-50/50">
          <ChefHat className="h-5 w-5 text-savory-500" />
          <span className="font-medium text-foreground">Restaurant</span>
          <span className="ml-auto inline-flex">
            <span className="h-5 w-5 rounded-full flex items-center justify-center bg-amber-400 text-white text-sm">
              😋
            </span>
          </span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NavItem 
          icon={Home} 
          label="Home" 
          to="/dashboard" 
          active={location.pathname === '/dashboard'} 
        />
        <NavItem 
          icon={UtensilsCrossed} 
          label="Food Order" 
          to="/food-order" 
          active={location.pathname === '/food-order'} 
        />
        <NavItem 
          icon={Heart} 
          label="Favorite Menu" 
          to="/favorite-menu" 
          active={location.pathname === '/favorite-menu'} 
        />
        <NavItem 
          icon={MessageSquare} 
          label="Message" 
          to="/messages" 
          active={location.pathname === '/messages'} 
        />
        <NavItem 
          icon={Clock} 
          label="Order History" 
          to="/order-history" 
          active={location.pathname === '/order-history'} 
        />
        <NavItem 
          icon={Bell} 
          label="Notification" 
          to="/notifications" 
          active={location.pathname === '/notifications'} 
        />
        <NavItem 
          icon={Receipt} 
          label="Bill" 
          to="/bills" 
          active={location.pathname === '/bills'} 
        />
        
        <div className="pt-2">
          <NavItem 
            icon={ChefHat} 
            label="Restaurant" 
            to="#" 
            hasChildren 
            expanded={openSections.restaurant}
            onClick={() => toggleSection('restaurant')}
            active={
              location.pathname === '/restaurant' || 
              location.pathname === '/restaurant/menu' || 
              location.pathname === '/restaurant/orders' || 
              location.pathname === '/restaurant/reviews'
            } 
          />
          
          {openSections.restaurant && (
            <div className="ml-5 space-y-1 mt-1">
              <NavItem 
                icon={() => <div className="w-1 h-5 rounded-full bg-savory-500 ml-2" />} 
                label="Restaurant" 
                to="/restaurant" 
                active={location.pathname === '/restaurant'} 
              />
              <NavItem 
                icon={() => <div className="w-1 h-5 ml-2" />} 
                label="Menu" 
                to="/restaurant/menu" 
                active={location.pathname === '/restaurant/menu'} 
              />
              <NavItem 
                icon={() => <div className="w-1 h-5 ml-2" />} 
                label="Orders" 
                to="/restaurant/orders" 
                active={location.pathname === '/restaurant/orders'} 
              />
              <NavItem 
                icon={() => <div className="w-1 h-5 ml-2" />} 
                label="Reviews" 
                to="/restaurant/reviews" 
                active={location.pathname === '/restaurant/reviews'} 
              />
            </div>
          )}
        </div>
        
        <NavItem 
          icon={Users} 
          label="Drivers" 
          to="/drivers" 
          hasChildren
          expanded={openSections.drivers}
          onClick={() => toggleSection('drivers')}
          active={location.pathname === '/drivers'} 
        />
        
        <NavItem 
          icon={Settings} 
          label="Setting" 
          to="/settings" 
          active={location.pathname === '/settings'} 
        />
      </nav>
      
      <div className="border-t border-border mt-auto p-4">
        <div className="text-center mb-3">
          <div className="relative w-20 mx-auto">
            <img 
              src="/burger-fries.png" 
              alt="Fast food" 
              className="w-full h-auto object-contain animate-fade-in"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/80x60/4CAF50/FFFFFF?text=🍔";
              }}
            />
          </div>
          <div className="mt-2 text-sm font-medium">Share your own recipe</div>
        </div>
        <button className="w-full py-2 bg-savory-500 hover:bg-savory-600 text-white rounded-lg transition-colors">
          Upload Now
        </button>
      </div>
    </aside>
  );
}
