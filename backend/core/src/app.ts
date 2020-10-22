import express from 'express';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {
  createNewOrUpdateExisting as createNewUserProfileOrUpdateExistingOne,
  getOne as getUserProfile, searchForUserProfilesBySkills,
} from './adapter/rest/user-profile.rest';
import {createNew as createNewSkill, search as searchForSkills} from './adapter/rest/skill.rest';
import {ValidationError} from './domain-model/validation';
import {getSecurityContextFrom} from './security-context';
import {searchForSkillsAndUserProfilesByNames} from './adapter/rest/top-search.rest';
import {getAllOfficeLocation} from './adapter/rest/office-location.rest';

const app = express();
// Enable JSON use
app.use(express.json());
// Handle 'preflight' requests (CORS)
app.options('*', (req: Request, res: Response) => {
  res.status(200).send();
});

app.get('/office-locations', getAllOfficeLocation);

app.get('/user-profiles/:username', getUserProfile);
app.post('/user-profiles', createNewUserProfileOrUpdateExistingOne);
app.put('/user-profiles/:username', createNewUserProfileOrUpdateExistingOne);
app.get('/search/user-profiles', searchForUserProfilesBySkills);

app.post('/skills', createNewSkill);
app.get('/search/skills', searchForSkills);

app.get('/search/top', searchForSkillsAndUserProfilesByNames);

// Routes
app.get('/*', (req, res) => {
  const context = {username: getSecurityContextFrom(req).currentUsername};
  res.send(context);
});

// Global error handler. It must have exactly this signature, thus ignoring ESLint here
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err.name === ValidationError.NAME) {
    res.status(400).send(err.message);
  } else {
    res.status(500).send('Internal Serverless Error: ' + err);
  }
});

export = app;
