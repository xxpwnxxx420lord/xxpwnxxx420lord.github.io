import type { NextApiRequest, NextApiResponse } from 'next';

type BlacklistEntry = { Username: string };
let blacklist: BlacklistEntry[] = [];

type ResponseData = {
  data: BlacklistEntry[];
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { Username } = req.body as { Username?: string };
    if (!Username) return res.status(400).json({ data: [], error: 'No username provided' });

    // prevent duplicates
    if (!blacklist.find(u => u.Username === Username)) {
      blacklist.push({ Username });
    }

    return res.status(200).json({ data: blacklist });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ data: blacklist });
  }

  return res.status(405).json({ data: [], error: 'Method not allowed' });
}
