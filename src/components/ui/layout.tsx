import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx"
import { AppSidebar } from "@/components/ui/app-sidebar.tsx"
import * as React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <main className="flex flex-col w-full items-center">

                {children}
            </main>
        </SidebarProvider>
    )
}