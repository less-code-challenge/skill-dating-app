import * as shell from 'shelljs';

shell.echo('-n','Copying package.json to dist... ');
shell.cp('-u','package.json', 'dist');
shell.echo('Done!');
shell.echo('-n', 'Installing packages in dist (npm install --production)... ');
shell.cd('dist');
if (shell.exec('npm install --production', {silent: true}).code !== 0) {
  shell.echo('Failed :(');
  shell.exit(1);
}
shell.echo('Done!');
