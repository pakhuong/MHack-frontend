import * as React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: React.ElementType;
    isActive?: boolean;
    badge?: string;
  }[];
}

export function NavMain({ items }: NavMainProps) {
  return (
    <div className="flex flex-col gap-1 p-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            to={item.url}
            className={`
              group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
              ${
                item.isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }
            `}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="ml-auto bg-zinc-700/50 text-zinc-100"
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </div>
  );
}