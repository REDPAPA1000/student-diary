import React from 'react';

export interface HeaderProps {
  title: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  backLink?: boolean;
}

export interface ResultPanelProps {
  promptText: string;
  setPromptText: (text: string) => void;
  defaultText: React.ReactNode;
  colorClass: string;
  isLoading?: boolean;
  title?: string;
  onReset?: () => void;
}

export type ActivityType = "자율활동" | "동아리활동" | "봉사활동" | "진로활동";