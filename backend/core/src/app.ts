import express from 'express';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {createNew as createNewUserProfile, getOne, update} from './adapter/rest/user-profile.rest';
import {createNew as createNewSkill, findAll as findAllSkills} from './adapter/rest/skill.rest';
import {ValidationError} from './domain-model/validation';

const app = express();
// Enable JSON use
app.use(express.json());

app.get('/user-profiles/:username', getOne);
app.post('/user-profiles', createNewUserProfile);
app.put('/user-profiles/:username', update);

app.post('/skills', createNewSkill);
app.get('/skills', findAllSkills);

// Routes
app.get('/*', (req, res) => {
  res.send(`Request received: ${req.method} - ${req.path}`);
});

// Global error handler. It must have exactly this signature, thus ignoring ESLint here
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err.name === ValidationError.NAME) {
    res.status(400).send(err.message);
  } else {
    res.status(500).send('Internal Serverless Error');
  }
});

export = app;
