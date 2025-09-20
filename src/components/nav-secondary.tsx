import * as React from 'react';
import { Link } from 'react-router-dom';

interface NavSecondaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string;
    url: string;
    icon: React.ElementType;
  }[];
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  return (
    <div {...props}>
      <div className="flex flex-col gap-1 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.url}
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}