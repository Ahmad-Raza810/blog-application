import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { PenSquare, LogOut, User, Settings, Sparkles, Menu } from 'lucide-react';

interface NavBarProps {
  isAuthenticated: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, userProfile, onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Tags", path: "/tags" },
  ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl" 
      className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/30 fixed top-0 z-50 transition-all duration-300"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-primary text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles size={20} />
            </div>
            <p className="font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
              Content Hub
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.path} isActive={isActive(item.path)}>
            <Link 
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path) 
                  ? "text-primary font-semibold" 
                  : "text-slate-600 dark:text-slate-300 hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {isAuthenticated ? (
          <>
            <NavbarItem className="hidden sm:flex">
              <Button
                as={Link}
                to="/posts/new"
                className="bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all font-medium"
                startContent={<PenSquare size={18} />}
                radius="full"
              >
                Write
              </Button>
            </NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={userProfile?.name?.charAt(0).toUpperCase()}
                  size="sm"
                  src={userProfile?.avatar}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold text-primary">{userProfile?.name}</p>
                </DropdownItem>
                <DropdownItem key="dashboard" href="/profile">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>My Profile</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="new_post" href="/posts/new" className="sm:hidden">
                  <div className="flex items-center gap-2">
                    <PenSquare size={16} />
                    <span>Write Post</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="drafts" href="/posts/drafts">
                  <div className="flex items-center gap-2">
                    <PenSquare size={16} />
                    <span>My Drafts</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={onLogout}>
                  <div className="flex items-center gap-2">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                as={Link} 
                to="/register" 
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                radius="full"
              >
                Get Started
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`w-full text-lg ${
                isActive(item.path) ? "text-primary font-semibold" : "text-foreground"
              }`}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;