declare global {
  interface Window {
    TradingView: {
      widget: new (options: TradingViewWidgetOptions) => any;
    };
  }
}

interface TradingViewWidgetOptions {
  autosize?: boolean;
  symbol: string;
  interval?: string;
  timezone?: string;
  theme?: 'light' | 'dark';
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  hide_top_toolbar?: boolean;
  hide_legend?: boolean;
  save_image?: boolean;
  container_id: string;
  width?: string;
  height?: string;
  show_popup_button?: boolean;
  popup_width?: string;
  popup_height?: string;
  backgroundColor?: string;
  gridColor?: string;
  studies?: string[];
}

export {};
