import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarHeader,
  SidebarSeparator,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChatList } from "@/components/ChatList";
import { NewChatButton } from "@/components/NewChatButton";
import { ProfileButton } from "@/components/ProfileButton";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenuButton asChild>
          <NewChatButton />
        </SidebarMenuButton>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ChatList />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <ProfileButton />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
