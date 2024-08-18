const smbClient = require('smb2'); // Use require if you're in a CommonJS environment
const path = require('path');
const fs = require('fs');

// Create an instance of smbClient (fill in your details)
const client = new smbClient({
  share: '\\\\your-samba-server\\shared-folder',
  domain: '',
  username: 'your-username',
  password: 'your-password',
});

const uploadFileToSamba = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      
      client.writeFile(`/${req.file.filename}`, data, (err) => {
        if (err) throw err;

        fs.unlink(filePath, (err) => {
          if (err) throw err;
          res.status(200).send('File uploaded and moved to Samba server.');
        });
      });
    });
  } catch (error) {
    res.status(500).send(`Error uploading file: ${error.message}`);
  }
};

module.exports = { uploadFileToSamba };
