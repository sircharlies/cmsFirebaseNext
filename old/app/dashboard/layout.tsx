"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOut, Home, FileText, Settings, ExternalLink } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Páginas",
    url: "/dashboard/pages",
    icon: FileText,
  },
  {
    title: "Configurações",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <Sidebar className="bg-slate-700 border-slate-600">
          <SidebarHeader className="bg-slate-800 border-b border-slate-600">
            <div className="px-2 py-2">
              <h2 className="text-lg font-semibold text-slate-100">CMS Dashboard</h2>
              <p className="text-sm text-slate-300">Bem-vindo, {user?.email}</p>
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-slate-700">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-300">Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        className="text-slate-200 hover:bg-slate-600 hover:text-white data-[active=true]:bg-slate-600 data-[active=true]:text-white"
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="bg-slate-700 border-t border-slate-600">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-slate-200 hover:bg-slate-600 hover:text-white">
                  <Link href="/" target="_blank">
                    <ExternalLink />
                    <span>Ver Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-slate-200 hover:bg-slate-600 hover:text-white"
                >
                  <LogOut />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto">
              <Button asChild variant="outline" size="sm">
                <Link href="/" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Site
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 bg-white">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
