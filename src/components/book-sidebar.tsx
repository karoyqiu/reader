import { Link } from '@tanstack/react-router';
import { BookIcon, ChevronRight, LibraryIcon, SectionIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from '@/components/ui/sidebar';
import type { BookChapter } from '@/lib/legado/book';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

type BookSidebarProps = {
  bookUrl: string;
  bookTitle: string;
  chapters: BookChapter[];
};

export function BookSidebar(props: BookSidebarProps) {
  const { bookUrl, bookTitle, chapters } = props;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Book</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <BookIcon />
                      <span>{bookTitle}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {chapters.map((ch) => (
                        <SidebarMenuItem key={ch.url}>
                          <SidebarMenuButton asChild>
                            <Link
                              className="[&.active]:bg-primary"
                              to="/book"
                              search={{ bookUrl, bookTitle, index: ch.index ?? 0 }}
                            >
                              <SectionIcon />
                              <span>{ch.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link className="[&.active]:bg-primary" to="/">
                <LibraryIcon />
                Bookshelf
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
