// app/models/types.ts

export interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
    chartType?: 'bar' | 'line' | 'pie' | 'histogram';
    data?: ChartData;
}

export interface ChartData {
    labels: string[];
    values: Record<string, number[]>;
}

export interface ApiResponse {
    success: boolean;
    result: {
        explanation: string;
        metadata: {
            x_axis: string[];
            y_axis: string[];
        };
        table: {
            "Brand/Retailer": string;
            Value_Share_Current: number;
            Value_Share_Change_bps: number;
            Volume_Share_Current: number;
            Volume_Share_Change_bps: number;
            Performance: string;
        }[];
    };
    error: string | null;
}


export interface AnalysisResult {
    analysis_plan?: string;
    pandas_code?: string;
    result_type?: string;
    assumptions?: string[];
    explanation: string;
    execution_status?: string;
    metadata: Metadata;
    table: TableRow[];
}

export interface Metadata {
    x_axis: string[];
    y_axis: string[];
}

export interface TableRow {
    [key: string]: string | number;
}
