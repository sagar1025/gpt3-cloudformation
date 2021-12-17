// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const d = req.body.description;
  console.log(d)
  res.status(200).json({ template: req.body.description })
}