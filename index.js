const glob = require('glob');
const semver = require('semver');

module.exports = isOnSnykVulnDB;
module.exports.getVulnPackagesList = getVulnPackagesList;

function isOnSnykVulnDB(packageName, version){

	return getVulnFiles(packageName).then(paths => {

		const vulnerabilities = paths
			.map(require)
			.map(data => ({ vuln: { title: data.title, severity: data.severity }, range: data.semver.vulnerable }))
			.filter(vulnObj => semver.satisfies(version, vulnObj.range))
			.map(data => data.vuln);

		return vulnerabilities.length ? vulnerabilities : false;

	});

}

function getVulnFiles(packageName){
	return new Promise((resolve, reject) => {

		glob(`${__dirname}/node_modules/@snyk/vulndb/data/npm/${packageName}/*/data.json`, (err, paths) => {
			if (err) return reject(err);
			return resolve(paths);
		});

	});
}

function getVulnPackagesList(){
  return new Promise((resolve, reject) => {

	  glob('node_modules/@snyk/vulndb/data/npm/*', (err, paths) => {
		  if (err) return reject(err);
		  return resolve(paths.map(packageNames));
	  });

  });

	function packageNames(path){
	  return path.replace('node_modules/@snyk/vulndb/data/npm/', '');
	}

}