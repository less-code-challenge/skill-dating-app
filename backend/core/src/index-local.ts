process.env.AWS_DYNAMODB_ENDPOINT = 'http://localhost:8000/';

import app from './app';

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));
