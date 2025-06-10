// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  if (prompt.toLowerCase().includes('sales')) {
    res.status(200).json({
      summary: "Sales in Q1 peaked in March with $120K revenue.",
      chartType: "bar",
      data: {
        labels: ["January", "February", "March"],
        values: [50000, 70000, 120000],
      },
    });
  } else {
    res.status(200).json({
      summary: "We offer a wide range of products in electronics and fashion.",
    });
  }
}
