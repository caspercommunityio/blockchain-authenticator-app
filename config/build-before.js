const fs = require('fs');
module.exports = (ctx) => {
  if (ctx.build && ctx.build.configuration && ctx.build.configuration === "production") {
    require('child_process').exec('git rev-parse HEAD', function(err, stdout) {
      let prodEnvData = fs.readFileSync(`src/environments/environment.prod.ts`, 'utf-8');
      prodEnvData = prodEnvData.replace(/version: ".*"/, `version: "${stdout.trim().substr(0,7)}"`);
      fs.writeFileSync('src/environments/environment.prod.ts', prodEnvData, 'utf-8');
      console.log("Setting up the version")
    });
  };

};