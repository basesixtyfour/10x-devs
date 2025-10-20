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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>10x-Devs</SidebarHeader>
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
      </SidebarContent>
    </Sidebar>
  );
}
