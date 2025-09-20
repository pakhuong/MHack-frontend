import * as React from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TeamSwitcherProps {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const [selectedTeam, setSelectedTeam] = React.useState(teams[0]);

  return (
    <div className="flex items-center gap-4 p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group flex h-9 w-full items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800/50 hover:text-white"
          >
            <selectedTeam.logo className="h-5 w-5 shrink-0 text-white" />
            <span className="truncate text-white">{selectedTeam.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[200px] bg-zinc-900 border border-zinc-800"
        >
          {teams.map((team) => {
            const Logo = team.logo;
            return (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setSelectedTeam(team)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              >
                <Logo className="h-5 w-5 shrink-0" />
                <span className="truncate">{team.name}</span>
                <span className="ml-auto text-xs text-zinc-500">
                  {team.plan}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}