import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend("re_ESYzD4mG_G3DFMbxau8w8cZvr5v64LoUT");

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const {email, subject, text} = req.body;
  const { data, error } = await resend.emails.send({
    from: 'bk@kreaitor.ai',
    to: [email],
    subject: subject,
    text: text,
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};