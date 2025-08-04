import { Link } from '@tanstack/react-router';
import { SectionIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { BookChapter } from '@/lib/legado/book';

type BookSidebarProps = {
  bookUrl: string;
  bookTitle: string;
  author: string;
  chapters: BookChapter[];
};

export function BookSidebar(props: BookSidebarProps) {
  const { bookUrl, bookTitle, author, chapters } = props;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{bookTitle}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chapters.map((ch) => (
                <SidebarMenuItem key={ch.url}>
                  <SidebarMenuButton asChild>
                    <Link
                      className="[&.active]:bg-primary"
                      to="/book"
                      search={{ bookUrl, bookTitle, author, index: ch.index ?? 0 }}
                      hash="top"
                    >
                      <SectionIcon />
                      <span>{ch.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
