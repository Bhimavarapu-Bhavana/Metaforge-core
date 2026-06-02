const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const configPath = path.join(__dirname, 'data', 'defaultConfig.json');

app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));
// ADD THE NEW ENDPOINT HERE:
app.post('/api/deploy', (req, res) => {
  console.log('Deployment triggered:', req.body);
  // Add logic here to interact with a cloud provider API
  res.status(200).json({ message: 'Deployment initiated' });
});

// If you have an app.listen(port, ...) call, keep it at the very bottom
function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('Failed to load default config:', error);
    return {
      app: { name: 'MetaForge App', version: '1.0.0', description: 'Runtime default configuration' },
      entities: [],
      pages: [],
      workflows: []
    };
  }
}

function validateConfig(config) {
  const issues = [];
  if (!config || typeof config !== 'object') {
    issues.push('Configuration is not a valid object.');
    return issues;
  }

  if (!config.app || !config.app.name) {
    issues.push('Missing required field: app.name');
  }

  if (!Array.isArray(config.entities)) {
    issues.push('Missing required entities array.');
  } else {
    config.entities.forEach((entity, entityIndex) => {
      if (!entity || typeof entity !== 'object') {
        issues.push(`Entity ${entityIndex} is invalid.`);
        return;
      }
      if (!entity.name) {
        issues.push(`Entity ${entityIndex} is missing a name.`);
      }
      if (!Array.isArray(entity.fields)) {
        issues.push(`Entity ${entity.name || entityIndex} must include a fields array.`);
      } else {
        const hasPrimary = entity.fields.some(field => Array.isArray(field.constraints) && field.constraints.includes('primary'));
        if (!hasPrimary) {
          issues.push(`Entity ${entity.name || entityIndex} has no primary key field.`);
        }
        entity.fields.forEach((field) => {
          if (field.reference && !field.reference.includes('.')) {
            issues.push(`Field ${field.name} in ${entity.name} has invalid reference ${field.reference}.`);
          }
        });
      }
    });
  }

  if (Array.isArray(config.pages)) {
    const allowedTypes = ['heading', 'text', 'image', 'table', 'list', 'card', 'form', 'button', 'input', 'container', 'columns', 'navbar', 'tabs', 'chart'];
    config.pages.forEach((page) => {
      if (page.components) {
        page.components.forEach((component) => {
          if (!allowedTypes.includes(component.type)) {
            issues.push(`Unknown component type: ${component.type} in page ${page.name || page.path || 'unknown'}.`);
          }
        });
      }
    });
  }

  return issues;
}

app.get('/api/config', (req, res) => {
  res.json(currentConfig);
});

app.post('/api/config', (req, res) => {
  const candidate = req.body;
  const issues = validateConfig(candidate);
  if (issues.length) {
    return res.status(400).json({ valid: false, issues });
  }
  currentConfig = candidate;
  return res.json({ valid: true, config: currentConfig });
});

app.post('/api/validate', (req, res) => {
  const config = req.body;
  const issues = validateConfig(config);
  res.json({ valid: issues.length === 0, issues });
});

app.post('/api/deploy', (req, res) => {
  const config = req.body;
  const issues = validateConfig(config);
  if (issues.length) {
    return res.status(400).json({ ok: false, issues });
  }
  const slug = (config.app.name || 'metaforge').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return res.json({ ok: true, url: `https://${slug}.metaforge.app` });
});

app.get('/api/:entity', (req, res) => {
  const entityName = req.params.entity;
  const entityKey = entityName.replace(/s$/, '');
  const entity = (currentConfig.entities || []).find((item) => item.name.toLowerCase() === entityKey.toLowerCase() || item.name.toLowerCase() === entityName.toLowerCase());
  if (!entity) {
    return res.status(404).json({ error: 'Entity not found' });
  }
  const rows = Array.from({ length: 5 }, (_, i) => {
    const record = {};
    (entity.fields || []).forEach((field) => {
      record[field.name] = field.type === 'uuid' ? `${entityKey}-${i + 1}` : field.type === 'integer' ? i + 1 : field.type === 'boolean' ? i % 2 === 0 : field.options ? field.options[i % field.options.length] : `${field.name}-${i + 1}`;
    });
    return record;
  });
  res.json({ entity: entity.name, items: rows });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`MetaForge backend running at http://localhost:${port}`);
});
