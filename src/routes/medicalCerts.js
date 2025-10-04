const express = require('express');
const router = express.Router();
const { requireAuth, authorizeRoles } = require('../middleware/auth');
const MedicalCertRequest = require('../models/MedicalCertRequest');
const Notification = require('../models/Notification');
const sendMail = require('../utils/mailer');
const PDFDocument = require('pdfkit');

// Create request
router.post('/', requireAuth, 
  async (req, res) => {
  const { reqType, reason } = req.body;
  try {
    const reqDoc = new MedicalCertRequest({
      user: req.user._id,
      reqType,
      reason
    });
    await reqDoc.save();

    await Notification.create({
      user: req.user._id,
      title: 'Medical certificate request submitted',
      message: `Your ${reqType} request has been submitted.`
    });

    await sendMail(
      req.user.email, 
      'Medical certificate request submitted', 
      `Your ${reqType} request has been submitted.`
    ).catch(e => 
      console.log(e.message));

    res.status(201).json(reqDoc);
  } catch (err) { 
    console.error(err); 
    res.status(500).json({ 
      message: 'Server error' 
    }); 
  }
});

// Get user's requests
router.get('/', requireAuth, 
  async (req, res) => {
  try {
    const list = await MedicalCertRequest.find({ 
      user: req.user._id 
    }).sort({ 
      createdAt: -1 
    });
    res.json(list);

  } catch (err) { 
    res.status(500).json({ 
      message: 'Server error' 
    }); 
  }
});

//Admin fills in certificate details
router.put('/:id/finalize', 
  requireAuth, authorizeRoles('admin'), 
  async (req, res) => {
  try {
    const { diagnosis, recommendations, physicianName, licenseNo, ptrNo } = req.body;

    const cert = await MedicalCertRequest.findById(req.params.id);
    if (!cert) return res.status(404).json({ 
      message: 'Certificate not found' 
    });

    cert.diagnosis = diagnosis;
    cert.recommendations = recommendations;
    cert.physicianName = physicianName;
    cert.licenseNo = licenseNo;
    cert.ptrNo = ptrNo;
    cert.status = 'approved';

    await cert.save();

    res.json({ 
      message: 'Medical certificate finalized', cert 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// Generate medical certificate PDF
router.get('/:id/pdf', requireAuth, 
  async (req, res) => {
  try {
    const cert = await MedicalCertRequest.findById(req.params.id).populate('user');
    if (!cert) return res.status(404).json({ 
      message: 'Certificate not found' 
    });
    if (cert.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Forbidden' 
      });
    }

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=medical_certificate_${cert._id}.pdf`);
    doc.pipe(res);

    //Certificate Content
    doc.fontSize(12).text(new Date().toLocaleDateString(), { align: 'right' });
    doc.moveDown(2);

    doc.text(`This is to certify that ${cert.user.fullName}, was seen and examined at the college clinic due to: ${cert.reason || "________________"}.\n`);
    doc.moveDown(1);

    doc.text(`Diagnosis: ${cert.diagnosis || "________________"}`);
    doc.moveDown(1);

    doc.text(`Recommendations: ${cert.recommendations || "________________"}`);
    doc.moveDown(4);

    doc.text("University Physician");
    doc.text(`Dr. ${cert.physicianName || "_________________"}`);
    doc.text(`License no. ${cert.licenseNo || "__________"}`);
    doc.text(`PTR no. ${cert.ptrNo || "__________"}`);

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
