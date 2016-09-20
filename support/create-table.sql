CREATE TABLE ParticleData (
  id VARCHAR(100),
  device_id VARCHAR(100),
  event VARCHAR(100),
  data VARCHAR(50),
  fw_version VARCHAR(12),
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);
