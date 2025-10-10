const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const BACKUP_DIR = path.join(__dirname, '..', 'backups');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

exports.createBackup = async (req, res) => {
  try {
    ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestamp}.gz`;
    const filepath = path.join(BACKUP_DIR, filename);
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      return res.status(500).json({ message: 'MongoDB URI not configured' });
    }

    // Check if mongodump is available
    exec('mongodump --version', (versionError) => {
      if (versionError) {
        return res.status(500).json({ 
          message: 'mongodump not found. Please install MongoDB Database Tools.',
          error: 'mongodump command not available in PATH'
        });
      }

      // Use mongodump to create archive
      const cmd = `mongodump --uri="${mongoUri}" --archive="${filepath}" --gzip`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error('Backup error:', error);
          return res.status(500).json({ 
            message: 'Backup failed', 
            error: stderr || error.message,
            details: 'Check MongoDB connection and permissions'
          });
        }
        return res.json({ message: 'Backup created successfully', file: filename });
      });
    });
  } catch (e) {
    console.error('Backup controller error:', e);
    res.status(500).json({ message: 'Backup failed', error: e.message });
  }
};

exports.listBackups = async (req, res) => {
  try {
    ensureBackupDir();
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.endsWith('.gz'))
      .map(f => ({ name: f, size: fs.statSync(path.join(BACKUP_DIR, f)).size, date: fs.statSync(path.join(BACKUP_DIR, f)).mtime }))
      .sort((a, b) => b.date - a.date);
    res.json(files);
  } catch (e) {
    res.status(500).json({ message: 'Failed to list backups', error: e.message });
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    ensureBackupDir();
    const file = req.params.file;
    const filepath = path.join(BACKUP_DIR, file);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Backup not found' });
    }
    res.download(filepath);
  } catch (e) {
    res.status(500).json({ message: 'Failed to download backup', error: e.message });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    ensureBackupDir();
    const { file, drop = true } = req.body;
    const filepath = path.join(BACKUP_DIR, file);
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      return res.status(500).json({ message: 'MongoDB URI not configured' });
    }

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }

    // Check if mongorestore is available
    exec('mongorestore --version', (versionError) => {
      if (versionError) {
        return res.status(500).json({ 
          message: 'mongorestore not found. Please install MongoDB Database Tools.',
          error: 'mongorestore command not available in PATH'
        });
      }

      const cmd = `mongorestore --uri="${mongoUri}" --archive="${filepath}" --gzip ${drop ? '--drop' : ''}`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error('Restore error:', error);
          return res.status(500).json({ 
            message: 'Restore failed', 
            error: stderr || error.message,
            details: 'Check MongoDB connection and backup file integrity'
          });
        }
        return res.json({ message: 'Restore completed successfully' });
      });
    });
  } catch (e) {
    console.error('Restore controller error:', e);
    res.status(500).json({ message: 'Restore failed', error: e.message });
  }
};



