"use client";

import { useState, useRef, useEffect } from "react";
import { AIRPORTS, POPULAR_AREAS, POPULAR_HOTELS, findAirportByCode, type AirportTerminal, type PopularArea, type PopularHotel } from "@/lib/locationData";

type LocationSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  isAirport?: boolean;
  locale?: string;
  className?: string;
};

export function LocationSelector({
  value,
  onChange,
  placeholder,
  label,
  isAirport = false,
  locale = "zh",
  className = ""
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isZh = locale.startsWith("zh");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (text: string) => {
    onChange(text);
    setIsOpen(false);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const suggestions: Array<{ text: string; subtitle?: string; type: "airport" | "area" | "hotel" }> = [];

  if (isAirport) {
    // 机场航站楼选项
    for (const airport of AIRPORTS) {
      const airportName = isZh ? airport.name.zh : airport.name.en;
      for (const terminal of airport.terminals) {
        const terminalName = isZh ? terminal.name.zh : terminal.name.en;
        const fullText = `${airport.code} ${terminal.code} - ${airportName} ${terminalName}`;
        if (!searchQuery || fullText.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.push({
            text: fullText,
            subtitle: `${airport.code} ${terminal.code}`,
            type: "airport"
          });
        }
      }
    }
  } else {
    // 热门区域
    for (const area of POPULAR_AREAS) {
      const name = isZh ? area.name.zh : area.name.en;
      if (!searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase()) || area.code.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.push({
          text: name,
          subtitle: area.city,
          type: "area"
        });
      }
    }
    // 热门酒店
    for (const hotel of POPULAR_HOTELS) {
      const name = isZh ? hotel.name.zh : hotel.name.en;
      if (!searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.push({
          text: name,
          subtitle: hotel.area,
          type: "hotel"
        });
      }
    }
  }

  const filteredSuggestions = suggestions.slice(0, 8);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label ? (
        <div className="text-sm text-slate-700 mb-1">{label}</div>
      ) : null}
      <div className="relative">
        <input
          type="text"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={isOpen ? searchQuery : value}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setShowSuggestions(true);
            setSearchQuery(value);
          }}
          placeholder={placeholder}
        />
        {isOpen && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
            {filteredSuggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                onClick={() => handleSelect(s.text)}
              >
                <div className="font-medium text-sm">{s.text}</div>
                {s.subtitle ? (
                  <div className="text-xs text-slate-500 mt-0.5">{s.subtitle}</div>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </div>
      {isOpen && !isAirport && (
        <div className="mt-1 text-xs text-slate-500">
          {isZh ? "提示：可输入具体地址，或从上方选择热门区域/酒店" : "Tip: Enter a specific address, or select from popular areas/hotels above"}
        </div>
      )}
    </div>
  );
}

