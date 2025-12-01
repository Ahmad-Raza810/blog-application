import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { Plus, Edit3, LogOut, User, BookDashed, Home, FolderTree, Tags, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { navbarVariants } from '../utils/animation-utils';

interface NavBarProps {
  isAuthenticated: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  userProfile,
  onLogout,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Tags', path: '/tags', icon: Tags },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className="sticky top-0 z-50 mb-6"
    >
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="bg-white/80 backdrop-blur-lg border-b-2 border-b-transparent"
        classNames={{
          wrapper: "px-4 sm:px-6"
        }}
        maxWidth="xl"
      >
        {/* Gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary" />
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <Logo />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="start">
          <NavbarBrand>
            <Logo />
          </NavbarBrand>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavbarItem
                key={item.path}
                isActive={location.pathname === item.path}
              >
                <Link
                  to={item.path}
                  className={`text-sm flex items-center gap-1.5 ${location.pathname === item.path
                    ? 'text-primary'
                    : 'text-default-600'
                    }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        <NavbarContent justify="end">
          {isAuthenticated ? (
            <>
              <NavbarItem>
                <Button
                  as={Link}
                  to="/posts/drafts"
                  color="secondary"
                  variant="flat"
                  startContent={<BookDashed size={16} />}
                >
                  Draft Posts
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  to="/posts/new"
                  color="primary"
                  variant="flat"
                  startContent={<Plus size={16} />}
                >
                  New Post
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform"
                      src={userProfile?.avatar}
                      name={userProfile?.name}
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User menu">
                    <DropdownItem
                      key="profile"
                      startContent={<User size={16} />}
                    >
                      <Link to="/profile">My Profile</Link>
                    </DropdownItem>
                    <DropdownItem
                      key="drafts"
                      startContent={<Edit3 size={16} />}
                    >
                      <Link to="/posts/drafts">My Drafts</Link>
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      startContent={<LogOut size={16} />}
                      className="text-danger"
                      color="danger"
                      onPress={onLogout}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Button
                  as={Link}
                  to="/login"
                  variant="flat"
                  startContent={<LogIn size={16} />}
                >
                  Log In
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  to="/register"
                  color="primary"
                  variant="flat"
                  startContent={<UserPlus size={16} />}
                >
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavbarMenuItem key={item.path}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-2 ${location.pathname === item.path
                    ? 'text-primary'
                    : 'text-default-600'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </NavbarMenu>
      </Navbar>
    </motion.div>
  );
};

export default NavBar;