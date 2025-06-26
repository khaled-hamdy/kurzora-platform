export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          subscription_tier: "starter" | "professional" | "elite";
          subscription_status: "trial" | "active" | "cancelled" | "expired";
          language: string;
          timezone: string;
          starting_balance: number;
          current_balance: number;
          risk_percentage: number;
          notification_settings: any;
          is_active: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          subscription_tier?: "starter" | "professional" | "elite";
          subscription_status?: "trial" | "active" | "cancelled" | "expired";
          language?: string;
          timezone?: string;
          starting_balance?: number;
          current_balance?: number;
          risk_percentage?: number;
          notification_settings?: any;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          subscription_tier?: "starter" | "professional" | "elite";
          subscription_status?: "trial" | "active" | "cancelled" | "expired";
          language?: string;
          timezone?: string;
          starting_balance?: number;
          current_balance?: number;
          risk_percentage?: number;
          notification_settings?: any;
          is_active?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}
