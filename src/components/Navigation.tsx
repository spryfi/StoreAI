import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart, 
  Settings, 
  Menu, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-background border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo and Toggle */}
        <div className="p-4 flex items-center justify-between border-b">
          <h1 className={cn("font-bold text-xl", isCollapsed && "hidden")}>✨ AI Trend</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            <li>
              <Button
                variant={activeTab === "trends" ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center p-2"
                )}
                onClick={() => onTabChange("trends")}
              >
                <LayoutDashboard className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                <span className={cn(isCollapsed && "hidden")}>Trends Monitor</span>
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "products" ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center p-2"
                )}
                onClick={() => onTabChange("products")}
              >
                <ShoppingBag className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                <span className={cn(isCollapsed && "hidden")}>Generated Products</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center p-2"
                )}
                disabled
              >
                <BarChart className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                <span className={cn(isCollapsed && "hidden")}>Analytics</span>
              </Button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center p-2"
            )}
            disabled
          >
            <Settings className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
            <span className={cn(isCollapsed && "hidden")}>Settings</span>
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
}