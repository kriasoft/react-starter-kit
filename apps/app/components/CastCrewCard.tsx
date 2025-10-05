
import React from "react";

export function CastCrewCard({ person }: { person: { image: string; name: string; role: string } }) {
  return (
    <div className="flex flex-col items-center w-28 flex-shrink-0 cursor-pointer group">
      <img 
        src={person.image} 
        alt={person.name} 
        className="w-24 h-24 object-cover rounded-full border-2 border-border group-hover:border-accent transition-colors"
        loading="lazy"
      />
      <span className="font-semibold text-sm mt-2 text-center line-clamp-2 group-hover:text-accent transition-colors">
        {person.name}
      </span>
      <span className="text-xs text-muted-foreground text-center line-clamp-1">
        {person.role}
      </span>
    </div>
  );
}
