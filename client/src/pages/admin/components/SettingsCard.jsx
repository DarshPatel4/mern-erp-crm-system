import React from 'react';

export default function SettingsCard({ id, icon, title, description, isSelected, onClick }) {
  // Base classes that apply to all cards
  const baseClasses = `
    bg-white rounded-2xl p-6 shadow
    flex flex-col items-center text-center
    cursor-pointer transition-all duration-200
    border border-gray-200 // Default subtle border for all cards when not hovered or selected
  `;

  // Classes for hover effects: shadow, scale, and the purple border/ring
  // These classes will apply when the mouse hovers over any card.
  const hoverClasses = `
    hover:shadow-lg
    hover:scale-105
    hover:border-violet-500
    hover:ring-violet-100
    hover:border-2
    hover:ring-4
  `;

  // Classes for the selected state: only a subtle background tint, no border.
  // This ensures that the selected card has a visual cue without the border
  // appearing by default, as per your request. The border will still appear on hover.
  const selectedBackgroundClass = isSelected
    ? 'bg-blue-50' // A light blue background tint for the selected card, as seen in the image.
    : '';

  // Combine all class strings.
  // The hover classes will override the default border when a card is hovered.
  // The selected background class will apply if the card is the active one.
  const cardClasses = `${baseClasses} ${hoverClasses} ${selectedBackgroundClass}`;

  return (
    <div className={cardClasses} onClick={() => onClick(id)}>
      <div className="mb-4 p-3 rounded-full bg-gray-100">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
