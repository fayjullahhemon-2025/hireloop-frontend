'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { LucideBookmark, LucideBriefcase, LucideBuilding2, LucideCreditCard, LucideFileText, LucideLayoutDashboard, LucideSettings, LucideUsers, Plus } from "lucide-react"
type roleType = 'admin' | 'seeker' | 'recruiter'
export function DashboardSidebar() {
    const { data: session, isPending } = useSession()
    const role = (session?.user?.role) as roleType || 'seeker'
    const Navlinks_By_Role = {
        seeker: [
            { title: 'Dashboard', href: `/Dashboard/seeker`, icon: LucideLayoutDashboard },
            { title: 'Jobs', href: `/Jobs/seeker`, icon: LucideBriefcase },
            { title: 'Saved Jobs', href: `/Saved-Jobs/seeker`, icon: LucideBookmark },
            { title: 'Applications', href: `/Applications/seeker`, icon: LucideFileText },
            { title: 'Billing', href: `/Billing/seeker`, icon: LucideCreditCard },
            { title: 'Settings', href: `/Settings/seeker`, icon: LucideSettings }
        ],
        admin: [
            { title: 'Dashboard', href: `/Dashboard/admin`, icon: LucideLayoutDashboard },
            { title: 'Users', href: `/Users/admin`, icon: LucideUsers },
            { title: 'Companies', href: `/Companies/admin`, icon: LucideBuilding2 },
            { title: 'Jobs', href: `/Jobs/admin`, icon: LucideBriefcase },
            { title: 'Payments', href: `/Payments/admin`, icon: LucideCreditCard },
            { title: 'Settings', href: `/Settings/admin`, icon: LucideSettings }
        ],
        recruiter: [
            { title: 'Dashboard', href: `/Dashboard/recruiter`, icon: LucideLayoutDashboard },
            { title: 'Manage Jobs', href: `/Manage-Jobs/recruiter`, icon: LucideBriefcase },
            { title: 'Applications', href: `/Applications/recruiter`, icon: LucideFileText },
            { title: 'Settings', href: `/Settings/recruiter`, icon: LucideSettings }
        ]
    };
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarMenu>
                        {Navlinks_By_Role[role].map((Item, idx) => (
                            <SidebarMenuItem key={idx}>
                                <SidebarMenuButton render={<a href={Item.href} />}>
                                    <Item.icon />
                                    <span>{Item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}