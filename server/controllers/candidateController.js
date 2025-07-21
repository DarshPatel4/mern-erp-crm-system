const Candidate = require('../models/Candidate');

exports.getCandidates = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const records = await Candidate.find(query).sort({ appliedDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch candidates', details: err.message });
  }
}; 