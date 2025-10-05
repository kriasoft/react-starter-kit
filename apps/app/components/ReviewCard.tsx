
import React from "react";

export function ReviewCard({ review }: { review: { user: string; rating: number; comment: string } }) {
  return (
    <div className="border border-border rounded-lg p-4 mb-3 bg-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm">
          {review.user.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <span className="font-semibold text-foreground">{review.user}</span>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span 
                key={i} 
                className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-muted-foreground'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
    </div>
  );
}
