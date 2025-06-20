// mockApiResponse.ts
import { ApiResponse } from '../models/models';

export const mockApiResponse: ApiResponse = {
  success: true,
  result: {
    explanation: "This analysis identifies which retailers or brands are driving Unilever's performance by examining market share data. The code first identifies Unilever-related entries (looking for 'HUL' which appears to be Hindustan Unilever Limited), then analyzes market share trends across different retailers/brands. It determines where Unilever is winning or losing market share by looking at the basis point changes in Value Share and Volume Share. The results are sorted to show the top market share holders, as well as the top 5 winning and losing entities based on Value Share changes. This provides a clear picture of which retailers are driving Unilever's performance and where the company is gaining or losing ground in the market.",
    metadata: {
      x_axis: ["Brand/Retailer"],
      y_axis: [
        "Value_Share_Current",
        "Value_Share_Change_bps",
        "Volume_Share_Current",
        "Volume_Share_Change_bps",
        "Performance"
      ]
    },
    table: [
      {
        "Brand/Retailer": "Retailer A",
        Value_Share_Current: 25.3,
        Value_Share_Change_bps: 120,
        Volume_Share_Current: 22.5,
        Volume_Share_Change_bps: 80,
        Performance: "Winning"
      },
      {
        "Brand/Retailer": "Retailer B",
        Value_Share_Current: 18.1,
        Value_Share_Change_bps: -50,
        Volume_Share_Current: 19.2,
        Volume_Share_Change_bps: -30,
        Performance: "Losing"
      }
      // Add more mock rows as needed
    ]
  },
  error: null
};
