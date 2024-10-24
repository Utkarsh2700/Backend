import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "lucide-react";
import { SidebarProvider } from "@/contexts/SidebarContext";

const Routes = () => {
  return (
    <SidebarProvider>
      <React.Fragment>
        <Header />
        <Sidebar />
        <Outlet />
        <Toaster />
      </React.Fragment>
    </SidebarProvider>
  );
};

export default Routes;
