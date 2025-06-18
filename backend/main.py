from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def get_analysis():
    return {
        "success": True,
        "result": {
            "explanation": (
                "This analysis identifies which retailers or brands are driving Unilever's performance by examining market share data. "
                "The code first identifies Unilever-related entries (looking for 'HUL' which appears to be Hindustan Unilever Limited), "
                "then analyzes market share trends across different retailers/brands. It determines where Unilever is winning or losing market share "
                "by looking at the basis point changes in Value Share and Volume Share. The results are sorted to show the top market share holders, "
                "as well as the top 5 winning and losing entities based on Value Share changes. This provides a clear picture of which retailers are "
                "driving Unilever's performance and where the company is gaining or losing ground in the market."
            ),
            "metadata": {
                "x_axis": ["Brand/Retailer"],
                "y_axis": [
                    "Value_Share_Current",
                    "Value_Share_Change_bps",
                    "Volume_Share_Current",
                    "Volume_Share_Change_bps",
                    "Performance"
                ]
            },
            "table": [
                {
                    "Brand/Retailer": "Retailer A",
                    "Value_Share_Current": 25,
                    "Value_Share_Change_bps": 40,
                    "Volume_Share_Current": 40,
                    "Volume_Share_Change_bps": 80,
                    "Performance": "Winning"
                },
                {
                    "Brand/Retailer": "Retailer B",
                    "Value_Share_Current": 30,
                    "Value_Share_Change_bps": 20,
                    "Volume_Share_Current": 30,
                    "Volume_Share_Change_bps": -30,
                    "Performance": "Winning"
                },
                {
                    "Brand/Retailer": "Retailer C",
                    "Value_Share_Current": 45,
                    "Value_Share_Change_bps": 40,
                    "Volume_Share_Current": 20,
                    "Volume_Share_Change_bps": 10,
                    "Performance": "Losing"
                }
            ]
        },
        "error": None
    }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)